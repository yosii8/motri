import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock, Heart, Phone, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FaFacebook, FaTelegram } from "react-icons/fa";

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleReportClick = () => {
    navigate("/report");
  };

  return (
    <div className="text-white flex flex-col bg-[#166866] min-h-screen">
      {/* ================= Hero Section ================= */}
      <section className="relative overflow-hidden py-6 md:py-10 px-3 sm:px-6">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-xl shadow-sm"></div>

        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-10 flex-wrap">
          {/* Left Text */}
          <div className="flex-1 min-w-[260px] text-center md:text-left md:-ml-20 z-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 leading-tight tracking-tight">
              {t("E-Report")}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg mb-2 opacity-90 leading-relaxed">
              {t("homeDescription")}
            </p>
            <p className="text-xs sm:text-sm lg:text-base mb-4 opacity-80 leading-relaxed">
              {t("homeSubDescription")}
            </p>

            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-3 sm:gap-4 flex-wrap">
              <Button
                onClick={handleReportClick}
                className="w-full sm:w-auto px-5 sm:px-6 py-2 text-sm sm:text-base lg:text-lg font-semibold rounded-xl shadow-md hover:scale-105 transition-transform"
              >
                {t("Report")}
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto px-5 sm:px-6 py-2 text-sm sm:text-base lg:text-lg font-semibold rounded-xl bg-white/20 border-white/40 text-white hover:bg-white/30 hover:scale-105 transition-transform"
              >
                {t("Help")}
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-shrink-0 flex justify-center w-full md:w-1/2 z-10 mt-6 md:mt-0">
            <img
              src="/one.png"
              alt="Hero Illustration"
              className="w-full max-w-[100px] sm:max-w-[150px] md:max-w-[200px] lg:max-w-[250px] h-auto object-contain"
            />
          </div>
        </div>
      </section>

      {/* ================= Features Section ================= */}
      <section className="py-10 px-3 sm:px-4 md:px-6 bg-white rounded-xl shadow-sm mx-2 md:mx-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 md:mb-8 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-2 text-gray-900">
              {t("E-Report")}
            </h2>
            <p className="text-base sm:text-lg opacity-90 text-gray-700">
              {t("safeSpaceCommitment")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6 text-center">
            <Card className="shadow-md border border-gray-100 bg-white text-gray-900 rounded-xl p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <Lock className="h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 text-indigo-600 mx-auto mb-2.5" />
                <CardTitle className="text-lg sm:text-xl font-semibold">
                  {t("confidential")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-sm sm:text-base">
                  {t("confidentialDesc")}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-md border border-gray-100 bg-white text-gray-900 rounded-xl p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <Heart className="h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 text-pink-500 mx-auto mb-2.5" />
                <CardTitle className="text-lg sm:text-xl font-semibold">
                  {t("compassionateSupport")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-sm sm:text-base">
                  {t("compassionateSupportDesc")}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-md border border-gray-100 bg-white text-gray-900 rounded-xl p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <Phone className="h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 text-green-500 mx-auto mb-2.5" />
                <CardTitle className="text-lg sm:text-xl font-semibold">
                  {t("available247")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-sm sm:text-base">
                  {t("available247Desc")}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ================= Call to Action + Footer ================= */}
      <section className="relative py-10 px-3 sm:px-4 md:px-6 bg-transparent flex-1">
        <div className="max-w-7xl mx-auto flex flex-col gap-6 relative">
          {/* CTA Text */}
          <div className="max-w-4xl mx-auto text-center md:text-left mb-24">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3 md:mb-5">
              {t("readyFirstStep")}
            </h2>
            <p className="text-base sm:text-lg mb-5 md:mb-8 opacity-90">
              {t("firstStepDesc")}
            </p>
            <Button
              onClick={handleReportClick}
              className="px-6 sm:px-8 lg:px-10 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg font-semibold bg-white text-indigo-600 rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              {t("startReport")}
            </Button>
          </div>

          {/* Bottom corners: Logo + Contact info */}
          <div className="absolute bottom-0 left-0 flex flex-col items-start gap-4 p-3 md:p-6">
            {/* Logo bottom-left */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
              <img
                src="/minstriy_logo.png"
                alt="Ministry Logo"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Contact info below logo */}
            <div className="flex flex-col items-start gap-2 sm:gap-3 text-sm sm:text-base text-white">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline"
              >
                <FaFacebook className="text-blue-500" /> Facebook
              </a>
              <a
                href="https://t.me/yourchannel"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline"
              >
                <FaTelegram className="text-sky-400" /> Telegram
              </a>
              <a
                href="mailto:example@email.com"
                className="flex items-center gap-2 hover:underline"
              >
                <Mail className="w-4 h-4" /> example@email.com
              </a>
              <a
                href="tel:+251900000000"
                className="flex items-center gap-2 hover:underline"
              >
                <Phone className="w-4 h-4" /> +251 900 000 000
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
