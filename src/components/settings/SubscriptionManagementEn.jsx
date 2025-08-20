import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Crown, AlertTriangle, RefreshCw, Loader2, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CancellationDialog from "./subscription/CancellationDialog";
import SubscriptionStatus from "./subscription/SubscriptionStatus";
import SubscriptionDetails from "./subscription/SubscriptionDetails";
import PremiumFeatures from "./subscription/PremiumFeatures";
import { supabase } from "@/lib/customSupabaseClient";

const SubscriptionManagement = () => {
  const { user, refreshUserProfile, subscriptionStatus, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isCancelling, setIsCancelling] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [cancellationStep, setCancellationStep] = useState(1);
  const [cancellationData, setCancellationData] = useState({
    reason: "",
    feedback: "",
    improvement: "",
  });

  const { nextPaymentDate, trialDaysLeft } = useMemo(() => {
    let paymentDate = null;
    let daysLeft = 0;

    if (user?.trial_end_date) {
      const trialEndDate = new Date(user.trial_end_date);
      paymentDate = trialEndDate;
      const diffTime = trialEndDate.getTime() - new Date().getTime();
      daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    } else if (user?.next_payment_date) {
      paymentDate = new Date(user.next_payment_date);
    }

    return {
      nextPaymentDate: paymentDate,
      trialDaysLeft: daysLeft,
    };
  }, [user]);

  const handleReactivateSubscription = async () => {
    setIsReactivating(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "iyzico-payment",
        {
          body: { action: "reactivate_subscription" },
        }
      );

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      await refreshUserProfile();
      toast({
        title: "Your subscription is reactivated! 🎉",
        description: "You can access your premium features again.",
        className:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          "An issue occurred while reactivating the subscription: " +
          error.message,
        variant: "destructive",
      });
    } finally {
      setIsReactivating(false);
    }
  };

  const handleConfirmCancellation = async () => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "iyzico-cancel-payment",
        {
          body: {
            action: "cancel_subscription",
            payload: {
              reason: cancellationData.reason,
              feedback: {
                feedback: cancellationData.feedback,
                improvement: cancellationData.improvement,
              },
            },
          },
        }
      );
      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      await refreshUserProfile();
      toast({
        title: "Cancellation Request Received",
        description: `Your subscription will end at the next billing period. Until then, you still have full access to premium features!`,
      });
      setIsCancelling(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          "An issue occurred while cancelling the subscription: " +
          error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenCancellationDialog = () => {
    setCancellationStep(1);
    setCancellationData({ reason: "", feedback: "", improvement: "" });
    setIsCancelling(true);
  };

  const isPendingCancellation =
    subscriptionStatus === "cancelled" && user?.cancellation_date;

  if (!["active", "trial", "cancelled"].includes(subscriptionStatus)) {
    return (
      <Card className='border-primary/20'>
        <CardHeader>
          <CardTitle className='flex items-center'>
            <Crown className='h-5 w-5 mr-2 text-primary' />
            Go Premium
          </CardTitle>
          <CardDescription>
            Unlock all features and enhance your learning experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <PremiumFeatures />
            <Button
              className='w-full btn-glow'
              onClick={() => navigate("/subscription")}
            >
              <Crown className='mr-2 h-4 w-4' />
              Go Premium – ₺99.99/month
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className='border-amber-200 dark:border-amber-800'>
        <CardHeader>
          <CardTitle className='flex items-center'>
            <Crown className='h-5 w-5 mr-2 text-amber-500' />
            Premium Subscription Management
          </CardTitle>
          <CardDescription>
            Manage your current subscription in detail.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            <SubscriptionStatus
              subscriptionStatus={subscriptionStatus}
              trialDaysLeft={trialDaysLeft}
              nextPaymentDate={nextPaymentDate}
              isPendingCancellation={isPendingCancellation}
            />

            <SubscriptionDetails
              profile={user}
              nextPaymentDate={nextPaymentDate}
            />

            <div className='pt-4 border-t border-border/50'>
              {isPendingCancellation ? (
                <div className='space-y-3'>
                  <Button
                    onClick={handleReactivateSubscription}
                    className='w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-green-500/50'
                    disabled={isReactivating}
                  >
                    {isReactivating ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                      <RefreshCw className='mr-2 h-4 w-4' />
                    )}
                    {isReactivating
                      ? "Reactivating..."
                      : "Keep Subscription Active"}
                  </Button>
                  <p className='text-xs text-muted-foreground text-center flex items-center justify-center gap-1.5'>
                    <Info className='h-3 w-3' /> We're glad you changed your
                    mind!
                  </p>
                </div>
              ) : (
                <Button
                  variant='outline'
                  className='w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300'
                  onClick={handleOpenCancellationDialog}
                >
                  <AlertTriangle className='mr-2 h-4 w-4' />
                  Cancel Subscription
                </Button>
              )}
            </div>

            <div
              className='flex justify-center items-center space-x-4 pt-4 border-t border-border/50'
              aria-label='Pay securely with iyzico – Visa & MasterCard supported'
            >
              <img
                src='https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/43bdb00cc0419a670bff93608bd18e93.png'
                alt='Pay with iyzico'
                className='h-8 object-contain'
              />
              <div className='border-l h-6 border-border'></div>
              <img
                src='https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/68cc4940906159e97da1ee1d73e1ebd3.png'
                alt='MasterCard'
                className='h-8 object-contain'
              />
              <img
                src='https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/2fcd11116b5d21ed99e9d7165d71bcc6.webp'
                alt='Visa'
                className='h-8 object-contain'
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <CancellationDialog
        isOpen={isCancelling}
        onClose={() => setIsCancelling(false)}
        onConfirmCancellation={handleConfirmCancellation}
        cancellationStep={cancellationStep}
        setCancellationStep={setCancellationStep}
        cancellationData={cancellationData}
        setCancellationData={setCancellationData}
        subscriptionEndDate={nextPaymentDate?.toLocaleDateString("en-US")}
        isProcessing={isProcessing}
      />
    </>
  );
};

export default SubscriptionManagement;
