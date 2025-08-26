import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Seo from "@/components/Seo";

const IyzicoCheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formContainerRef = useRef(null);
  const { checkoutFormContent } = location.state || {};

  useEffect(() => {
    if (!checkoutFormContent) {
      navigate("/subscription", { replace: true });
      return;
    }

    const container = formContainerRef.current;
    if (container) {
      container.innerHTML = checkoutFormContent;
      const scripts = Array.from(container.getElementsByTagName("script"));

      scripts.forEach((oldScript) => {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
    }
  }, [checkoutFormContent, navigate]);

  if (!checkoutFormContent) {
    return null;
  }

  return (
    <>
      <Seo
        title='Ödeme Yapılıyor'
        description='Güvenli ödeme sayfasına yönlendiriliyorsunuz.'
        noindex={true}
      />
      <div className='flex flex-col items-center justify-center min-h-screen bg-background text-center p-4'>
        <Loader2 className='h-12 w-12 animate-spin text-primary mb-4' />
        <h1 className='text-2xl font-bold'>
          Güvenli Ödeme Sayfasına Yönlendiriliyorsunuz...
        </h1>
        <p className='text-muted-foreground mt-2'>
          Lütfen bekleyin, bu işlem birkaç saniye sürebilir.
        </p>
        <div
          id='iyzipay-checkout-form'
          ref={formContainerRef}
          className='w-full h-full absolute top-0 left-0 responsive'
        ></div>
      </div>
    </>
  );
};

export default IyzicoCheckoutPage;
