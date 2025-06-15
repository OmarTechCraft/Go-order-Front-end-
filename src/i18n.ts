import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en", // اللغة الاحتياطية إذا لم يتم العثور على ترجمة
    resources: {
      en: {
        translation: {
          // Navbar translations
          "GoOrder": "GoOrder",
          "Login": "Login",
          "Dashboard": "Dashboard",
          "Logout": "Logout",
          "Confirm Logout": "Confirm Logout",
          "Are you sure you want to sign out of your account?": "Are you sure you want to sign out of your account?",
          "Cancel": "Cancel",
          "Sign Out": "Sign Out",

          // Home page static text translations
          "Claim Best Offer": "Claim Best Offer",
          "on": "on",
          "Order": "Order", // الكلمة الإنجليزية الأصلية لتصميمها الخاص
          "“Dare to Be Different, Shop With Us”": "“Dare to Be Different, Shop With Us”",
          "Get Started": "Get Started",
          "Our Happy Customer": "Our Happy Customer",
          "WHAT WE SERVE": "WHAT WE SERVE",
          "Your Favourite Delivery Partner": "Your Favourite Delivery Partner",
          "Easy To Order": "Easy To Order",
          "You only need a few steps in ordering": "You only need a few steps in ordering",
          "Fastest Delivery": "Fastest Delivery",
          "Delivery that is always on time, even faster": "Delivery that is always on time, even faster",
          "Best Quality": "Best Quality",
          "Not only fast, our quality is also number one": "Not only fast, our quality is also number one",
          "About Us": "About Us",
          "Who We Are": "Who We Are",
          "GoOrder, the leading on-demand food and Q-commerce app for everyday deliveries, has been offering convenience and reliability to its customers. We harness innovative technology and knowledge to simplify everyday life for our customers, optimize operations for our restaurants and local shops, and provide our riders with reliable earning opportunities daily.": "GoOrder, the leading on-demand food and Q-commerce app for everyday deliveries, has been offering convenience and reliability to its customers. We harness innovative technology and knowledge to simplify everyday life for our customers, optimize operations for our restaurants and local shops, and provide our riders with reliable earning opportunities daily.",
          "Join As Partner": "Join As Partner",
          "We Deliver": "We Deliver",
          "A GoOrder rider will be along shortly to pick up the order and deliver it to the customer. We highly recommend other restaurants to work with Talabat and experience the benefits of their joint partnership. Delivery that is always on time, even faster.": "A GoOrder rider will be along shortly to pick up the order and deliver it to the customer. We highly recommend other restaurants to work with Talabat and experience the benefits of their joint partnership. Delivery that is always on time, even faster.",
          "Join as Deliver": "Join as Deliver",
          "DOWNLOAD APP": "DOWNLOAD APP",
          "Download Our Application Now!": "Download Our Application Now!",
          "Discover order wherever and whenever and get your order delivered quickly.": "Discover order wherever and whenever and get your order delivered quickly.",
          "GET IT ON": "GET IT ON",
          "Google Play": "Google Play",
          "Download on the": "Download on the",
          "App Store": "App Store",
          "Our job is to fill your tummy with delicious food and with fast and free delivery.": "Our job is to fill your tummy with delicious food and with fast and free delivery.",
          "You can find us there": "You can find us there",
          "Contact info": "Contact info",
          "Phone number :": "Phone number :",
          "Address :": "Address :",
          "Egypt - Cairo": "Egypt - Cairo",
          "Get Help": "Get Help",
          "Privacy Notice": "Privacy Notice",
          "Terms & Conditions": "Terms & Conditions",
        },
      },
      ar: {
        translation: {
          // Navbar translations
          "GoOrder": "جو أوردر",
          "Login": "تسجيل الدخول",
          "Dashboard": "لوحة القيادة",
          "Logout": "تسجيل الخروج",
          "Confirm Logout": "تأكيد تسجيل الخروج",
          "Are you sure you want to sign out of your account?": "هل أنت متأكد أنك تريد تسجيل الخروج من حسابك؟",
          "Cancel": "إلغاء",
          "Sign Out": "تسجيل الخروج",

          // Home page static text translations
          "Claim Best Offer": "احصل على أفضل عرض",
          "on": "على",
          "Order": "الأوردر", // <--- تم تعديلها هنا لتكون "الأوردر" ككلمة واحدة
          "“Dare to Be Different, Shop With Us”": "“تجرأ على أن تكون مختلفًا، تسوق معنا”",
          "Get Started": "ابدأ الآن",
          "Our Happy Customer": "عملاؤنا السعداء",
          "WHAT WE SERVE": "ماذا نقدم",
          "Your Favourite Delivery Partner": "شريك التوصيل المفضل لديك",
          "Easy To Order": "سهل الطلب",
          "You only need a few steps in ordering": "كل ما تحتاجه هو بضع خطوات للطلب",
          "Fastest Delivery": "أسرع توصيل",
          "Delivery that is always on time, even faster": "توصيل في الوقت المحدد دائمًا، بل وأسرع",
          "Best Quality": "أفضل جودة",
          "Not only fast, our quality is also number one": "ليس فقط سريعًا، بل جودتنا هي الأفضل",
          "About Us": "عنا",
          "Who We Are": "من نحن",
          "GoOrder, the leading on-demand food and Q-commerce app for everyday deliveries, has been offering convenience and reliability to its customers. We harness innovative technology and knowledge to simplify everyday life for our customers, optimize operations for our restaurants and local shops, and provide our riders with reliable earning opportunities daily.": "جو أوردر، تطبيق الطعام والتجارة الإلكترونية الرائد عند الطلب للتوصيلات اليومية، يقدم الراحة والموثوقية لعملائه. نحن نستفيد من التكنولوجيا المبتكرة والمعرفة لتبسيط الحياة اليومية لعملائنا، وتحسين عمليات مطاعمنا ومتاجرنا المحلية، وتزويد راكبينا بفرص كسب موثوقة يوميًا.",
          "Join As Partner": "انضم كشريك",
          "We Deliver": "نحن نوصل",
          "A GoOrder rider will be along shortly to pick up the order and deliver it to the customer. We highly recommend other restaurants to work with Talabat and experience the benefits of their joint partnership. Delivery that is always on time, even faster.": "سيكون سائق جو أوردر في الطريق قريبًا لاستلام الطلب وتوصيله للعميل. نوصي بشدة المطاعم الأخرى بالعمل مع طلبات وتجربة فوائد الشراكة المشتركة بينهما. توصيل في الوقت المحدد دائمًا، بل وأسرع.",
          "Join as Deliver": "انضم كمندوب توصيل",
          "DOWNLOAD APP": "حمل التطبيق",
          "Download Our Application Now!": "حمل تطبيقنا الآن!",
          "Discover order wherever and whenever and get your order delivered quickly.": "اكتشف الطلبات في أي مكان وزمان واحصل على طلبك بسرعة.",
          "GET IT ON": "احصل عليه من",
          "Google Play": "جوجل بلاي",
          "Download on the": "حمل من",
          "App Store": "آب ستور",
          "Our job is to fill your tummy with delicious food and with fast and free delivery.": "مهمتنا هي ملء بطنك بالطعام اللذيذ وتوصيل سريع ومجاني.",
          "You can find us there": "يمكنك أن تجدنا هناك",
          "Contact info": "معلومات الاتصال",
          "Phone number :": "رقم الهاتف :",
          "Address :": "العنوان :",
          "Egypt - Cairo": "مصر - القاهرة",
          "Get Help": "احصل على مساعدة",
          "Privacy Notice": "إشعار الخصوصية",
          "Terms & Conditions": "الشروط والأحكام",
        },
      },
    },
    interpolation: {
      escapeValue: false, // لا تقوم بعمل هروب (escaping) لمتغيرات HTML
    },
  });

export default i18n;