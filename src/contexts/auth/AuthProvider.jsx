import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { supabase } from "@/lib/customSupabaseClient";
import { Loader2 } from "lucide-react";
import { AuthContext } from "./AuthContext";
import { loadUserProfile } from "./AuthHelpers";
import DOMPurify from "dompurify";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const authListenerRef = useRef(null);
  const initializingRef = useRef(false);
  const lastSessionRef = useRef(null);
  const mountedRef = useRef(true);

  const loadProfile = useCallback(async (authUser, preserveUser = null) => {
    if (!mountedRef.current) return;

    try {
      await loadUserProfile(authUser, setUser, preserveUser);
    } catch (error) {
      console.error("❌ Profile loading failed:", error);
    }
  }, []);

  const refreshUserProfile = useCallback(async () => {
    if (!user) return;
    console.log("🔄 Refreshing user profile...");
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.user) {
      await loadProfile(session.user);
      console.log("✅ User profile refreshed.");
    }
  }, [user, loadProfile]);

  const reauthenticate = useCallback(
    async (password) => {
      if (!user?.email) {
        return { error: new Error("Kullanıcı e-postası bulunamadı.") };
      }

      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password,
      });

      return { error: reauthError };
    },
    [user]
  );

  useEffect(() => {
    mountedRef.current = true;

    const initialize = async () => {
      if (initializingRef.current) return;
      initializingRef.current = true;

      try {
        console.log("🔄 Initializing auth...");

        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Session timeout")), 5000)
        );

        const {
          data: { session },
          error,
        } = await Promise.race([sessionPromise, timeoutPromise]);

        if (!mountedRef.current) return;

        if (error) {
          console.error("❌ Session error:", error);
          setUser(null);
          setAuthError(error.message);
        } else if (session?.user) {
          console.log("✅ Session found, loading profile...");
          lastSessionRef.current = session.user.id;
          await loadProfile(session.user);
        } else {
          console.log("ℹ️ No active session");
          setUser(null);
          lastSessionRef.current = null;
        }

        if (!authListenerRef.current) {
          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!mountedRef.current) return;

            console.log("🔄 Auth state change:", event, session?.user?.email);

            const currentUserId = session?.user?.id;
            const lastUserId = lastSessionRef.current;

            try {
              if (event === "SIGNED_IN" && session?.user) {
                console.log("✅ User signed in");
                if (currentUserId !== lastUserId) {
                  lastSessionRef.current = currentUserId;
                  await loadProfile(session.user);
                }
              } else if (event === "SIGNED_OUT") {
                console.log("👋 User signed out");
                setUser(null);
                setAuthError(null);
                lastSessionRef.current = null;
              } else if (event === "TOKEN_REFRESHED") {
                if (session?.user) {
                  console.log(
                    "🔄 Token refreshed successfully, reloading profile to ensure state consistency."
                  );
                  await loadProfile(session.user, user);
                } else {
                  console.log("❌ Token refresh failed, signing out.");
                  setUser(null);
                  setAuthError(
                    "Oturumunuzun süresi doldu. Lütfen tekrar giriş yapın."
                  );
                  lastSessionRef.current = null;
                }
              } else if (event === "USER_UPDATED") {
                if (session?.user) {
                  console.log("🔄 User data updated, reloading profile");
                  await loadProfile(session.user, user);
                }
              } else if (!session && lastUserId) {
                console.log("❌ Session lost, signing out.");
                setUser(null);
                lastSessionRef.current = null;
              }
            } catch (error) {
              console.error("❌ Auth state change error:", error);
              if (event === "SIGNED_OUT" || !session) {
                setUser(null);
                lastSessionRef.current = null;
              }
            }
          });

          authListenerRef.current = subscription;
        }
      } catch (error) {
        console.error("❌ Auth initialization error:", error);
        if (mountedRef.current) {
          setUser(null);
          if (!error.message.includes("timeout")) {
            setAuthError(error.message);
          }
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
          setInitialized(true);
          initializingRef.current = false;
        }
      }
    };

    initialize();

    return () => {
      mountedRef.current = false;
      if (authListenerRef.current) {
        authListenerRef.current.unsubscribe();
        authListenerRef.current = null;
      }
    };
  }, [loadProfile, user]);

  const login = useCallback(async (email, password) => {
    try {
      setAuthError(null);
      console.log("🔐 Login attempt for:", email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: DOMPurify.sanitize(email.toLowerCase().trim()),
        password,
      });

      if (error) {
        console.error("❌ Login error:", error);
        throw error;
      }

      console.log("✅ Login successful");
      return data;
    } catch (error) {
      console.error("❌ Login failed:", error);
      setAuthError(error.message);
      throw error;
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      setAuthError(null);
      console.log("📝 Registration attempt for:", email);

      const sanitizedName = DOMPurify.sanitize(name.trim());
      const sanitizedEmail = DOMPurify.sanitize(email.toLowerCase().trim());

      if (!sanitizedName || sanitizedName.length < 2) {
        throw new Error("Ad Soyad en az 2 karakter olmalıdır");
      }
      if (
        !sanitizedEmail ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)
      ) {
        throw new Error("Geçerli bir e-posta adresi girin");
      }
      if (!password || password.length < 6) {
        throw new Error("Şifre en az 6 karakter olmalıdır");
      }

      const { data: emailExists, error: rpcError } = await supabase.rpc(
        "check_email_exists",
        {
          p_email: sanitizedEmail,
        }
      );

      if (rpcError) {
        console.error("Error checking email via RPC:", rpcError);
      }

      if (emailExists) {
        throw new Error(
          "Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin."
        );
      }

      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name: sanitizedName,
          },
        },
      });

      if (error) {
        console.error("❌ Registration error:", error);

        if (
          error.message.includes("User already registered") ||
          error.message.includes("already been registered") ||
          error.message.includes("Email address already registered")
        ) {
          throw new Error(
            "Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin."
          );
        }

        if (
          error.message.includes("Email address") &&
          error.message.includes("is invalid")
        ) {
          throw new Error(
            "Geçersiz e-posta adresi. Lütfen geçerli bir e-posta adresi kullanın."
          );
        }

        throw error;
      }

      console.log("✅ Registration successful");
      return data;
    } catch (error) {
      console.error("❌ Registration failed:", error);
      setAuthError(error.message);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthError(null);
    console.log("🚪 Logging out...");

    try {
      const { error } = await supabase.auth.signOut();
      if (
        error &&
        !error.message.includes(
          "Session from session_id claim in JWT does not exist"
        )
      ) {
        console.warn(
          "Supabase signout warning (handled gracefully):",
          error.message
        );
      }
    } catch (e) {
      console.error("A critical error occurred during the logout process:", e);
    } finally {
      if (mountedRef.current) {
        setUser(null);
        lastSessionRef.current = null;
        console.log("✅ Local logout process completed.");
      }
    }
  }, []);

  const updateUser = useCallback(
    async (newUserData) => {
      if (!user) return;

      try {
        setAuthError(null);
        console.log("📝 Updating user profile...", newUserData);

        const sanitizedUserData = { ...newUserData };
        if (sanitizedUserData.name) {
          sanitizedUserData.name = DOMPurify.sanitize(
            sanitizedUserData.name.trim()
          );
        }

        const { data, error } = await supabase
          .from("profiles")
          .update({
            ...sanitizedUserData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id)
          .select()
          .single();

        if (error) {
          console.error("❌ Profile update error:", error);
          throw error;
        }

        setUser((prevUser) => ({
          ...prevUser,
          ...data,
        }));

        console.log("✅ Profile updated successfully");
        return data;
      } catch (error) {
        console.error("❌ Update user failed:", error);
        setAuthError(error.message);
        throw error;
      }
    },
    [user]
  );

  const subscriptionStatus = useMemo(() => {
    if (!user) return "none";
    return user.subscription_status || "none";
  }, [user]);

  const canAccessPremiumFeatures = useMemo(() => {
    if (!user) return false;
    const status = user.subscription_status;
    if (status === "active" || status === "trial") {
      return true;
    }
    if (status === "cancelled" && user.next_payment_date) {
      return new Date(user.next_payment_date) > new Date();
    }
    return false;
  }, [user]);

  const contextValue = React.useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      updateUser,
      loading,
      authError,
      initialized,
      reauthenticate,
      canAccessPremiumFeatures,
      subscriptionStatus,
      refreshUserProfile,
    }),
    [
      user,
      login,
      register,
      logout,
      updateUser,
      loading,
      authError,
      initialized,
      reauthenticate,
      canAccessPremiumFeatures,
      subscriptionStatus,
      refreshUserProfile,
    ]
  );

  if (loading && !initialized) {
    return (
      <div className='flex h-screen items-center justify-center bg-background'>
        <div className='text-center'>
          <Loader2 className='h-8 w-8 animate-spin text-primary mx-auto mb-4' />
          <p className='text-sm text-muted-foreground'>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
