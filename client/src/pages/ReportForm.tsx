import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FormData {
  name: string;
  email: string;
  phone: string;
  abuseType: string;
  description: string;
  sex: string;
  workPosition: string;
  educationLevel: string;
  jobType: string;
  incidentTime: string;
  incidentPlace: string;
  incidentDay: string;
  image?: File | null;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  abuseType: "",
  description: "",
  sex: "",
  workPosition: "",
  educationLevel: "",
  jobType: "",
  incidentTime: "",
  incidentPlace: "",
  incidentDay: "",
  image: null,
};

const ReportForm: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  // ✅ Automatically select API base URL
  const API_URL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD
      ? "https://motri-api.vercel.app"
      : "http://localhost:5005");

  // Get stored email (user identification)
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    setUserEmail(email);
    if (email) {
      setFormData((prev) => ({ ...prev, email }));
    }
    // Run only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (field: keyof FormData, value: string | File) => {
    setFormData((prev) => ({ ...prev, [field]: value as any }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields (except image)
    for (const key in formData) {
      if (key === "image") continue;
      const val = (formData as any)[key];
      if (!val || String(val).trim() === "") {
        toast({
          title: t("missingInfoTitle") || "Missing Information",
          description: t("missingInfoDesc") || "Please fill all fields.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);
    try {
      const formPayload = new FormData();
      for (const key in formData) {
        const value = (formData as any)[key];
        if (value instanceof File) {
          formPayload.append("image", value);
        } else {
          formPayload.append(key, value ?? "");
        }
      }

      // ✅ Correct backend endpoint
      const response = await fetch(`${API_URL}/api/reports`, {
        method: "POST",
        body: formPayload,
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        toast({
          title: t("reportSuccessTitle") || "Report Submitted",
          description:
            t("reportSuccessDesc") || "Your report was successfully sent.",
          variant: "default",
        });
        setFormData(initialFormData);

        // Refill email after reset if stored
        const email = localStorage.getItem("userEmail");
        if (email) setFormData((prev) => ({ ...prev, email }));
      } else {
        throw new Error(result.message || "Failed to submit report");
      }
    } catch (error) {
      toast({
        title: t("reportFailTitle") || "Submission Failed",
        description:
          error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto pt-16">
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardHeader className="text-center">
              <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
              <CardTitle className="text-2xl text-success">
                {t("reportSuccessTitle")}
              </CardTitle>
              <CardDescription className="text-lg">
                {t("reportSuccessDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Button
                className="bg-[#0D4D4D] hover:bg-[#0b3c3c] text-white"
                onClick={() => setIsSubmitted(false)}
              >
                {t("submitAnother") || "Submit Another Report"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* User header */}
        {userEmail && (
          <div className="flex items-center justify-between mb-4 bg-[#0D4D4D] text-white p-3 rounded-lg shadow">
            <div className="flex items-center space-x-2">
              <img
                src="/user_icon.png"
                alt="User"
                className="h-8 w-8 rounded-full bg-white object-cover"
              />
              <span>{userEmail}</span>
            </div>
            <button
              className="text-sm underline"
              onClick={() => {
                localStorage.removeItem("userEmail");
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <img
            src="/minstriy_logo.png"
            alt="Ministry Logo"
            className="h-16 w-16 mx-auto mb-4 rounded-full object-contain"
          />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t("confidentialReportForm")}
          </h1>
          <p className="text-muted-foreground">{t("infoSecure")}</p>
        </div>

        <Card className="shadow-card border border-border bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              <span>{t("reportIncident")}</span>
            </CardTitle>
            <CardDescription>{t("reportIncidentDesc")}</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">{t("fullName")}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Phone & Abuse Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">{t("phone")}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="abuseType">{t("abuseType")}</Label>
                  <Select
                    value={formData.abuseType}
                    onValueChange={(v) => handleInputChange("abuseType", v)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectAbuseType")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Physical">{t("physical")}</SelectItem>
                      <SelectItem value="Emotional">{t("emotional")}</SelectItem>
                      <SelectItem value="Sexual">{t("sexual")}</SelectItem>
                      <SelectItem value="Financial">{t("financial")}</SelectItem>
                      <SelectItem value="Other">{t("other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">{t("description")}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  required
                />
              </div>

              {/* Sex & Work Position */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sex">{t("sex")}</Label>
                  <Select
                    value={formData.sex}
                    onValueChange={(v) => handleInputChange("sex", v)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectSex")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">{t("male")}</SelectItem>
                      <SelectItem value="Female">{t("female")}</SelectItem>
                      <SelectItem value="Other">{t("other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="workPosition">{t("workPosition")}</Label>
                  <Select
                    value={formData.workPosition}
                    onValueChange={(v) => handleInputChange("workPosition", v)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectWorkPosition")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">{t("low")}</SelectItem>
                      <SelectItem value="Medium">{t("midium")}</SelectItem>
                      <SelectItem value="High">{t("high")}</SelectItem>
                      <SelectItem value="Leader">{t("leder")}</SelectItem>
                      <SelectItem value="Admin">{t("adminster")}</SelectItem>
                      <SelectItem value="Other">{t("other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Education Level & Job Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="educationLevel">{t("educationLevel")}</Label>
                  <Select
                    value={formData.educationLevel}
                    onValueChange={(v) => handleInputChange("educationLevel", v)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectEducation")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Primary">{t("primary")}</SelectItem>
                      <SelectItem value="Secondary">{t("secondary")}</SelectItem>
                      <SelectItem value="Diploma">{t("diploma")}</SelectItem>
                      <SelectItem value="Bachelor">{t("bachelor")}</SelectItem>
                      <SelectItem value="Other">{t("other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="jobType">{t("jobType")}</Label>
                  <Select
                    value={formData.jobType}
                    onValueChange={(v) => handleInputChange("jobType", v)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectJobType")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Government">{t("government")}</SelectItem>
                      <SelectItem value="Private">{t("private")}</SelectItem>
                      <SelectItem value="Self-employed">
                        {t("selfEmployed")}
                      </SelectItem>
                      <SelectItem value="Unemployed">
                        {t("unemployed")}
                      </SelectItem>
                      <SelectItem value="Other">{t("other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Incident Time & Place */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="incidentTime">{t("incidentTime")}</Label>
                  <Input
                    id="incidentTime"
                    value={formData.incidentTime}
                    onChange={(e) =>
                      handleInputChange("incidentTime", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="incidentPlace">{t("incidentPlace")}</Label>
                  <Input
                    id="incidentPlace"
                    value={formData.incidentPlace}
                    onChange={(e) =>
                      handleInputChange("incidentPlace", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {/* Incident Day */}
              <div>
                <Label htmlFor="incidentDay">{t("incidentDay")}</Label>
                <Input
                  id="incidentDay"
                  type="date"
                  value={formData.incidentDay}
                  onChange={(e) => handleInputChange("incidentDay", e.target.value)}
                  required
                />
              </div>

              {/* Optional Image Upload */}
              <div>
                <Label htmlFor="image">
                  {t("uploadImage") || "Upload Image (Optional)"}
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files &&
                    handleInputChange("image", e.target.files[0])
                  }
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-[#0D4D4D] hover:bg-[#0b3c3c] text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {t("submitting")}
                  </>
                ) : (
                  t("submitReport")
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportForm;
