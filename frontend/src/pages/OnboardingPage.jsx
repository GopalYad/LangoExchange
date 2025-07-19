// src/pages/OnboardingPage.jsx
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LoaderIcon,
  MapPinIcon,
  ShipWheelIcon,
  ShuffleIcon,
  CameraIcon,
} from "lucide-react";

import useAuthUser from "../hooks/useAuthUser";
import { completeOnboarding } from "../lib/api";
import { LANGUAGES } from "../constants";

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/adventurer/svg?seed=default";


const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

 
const [formState, setFormState] = useState({
  fullName: authUser?.fullName || "",
  bio: authUser?.bio || "",
  nativeLanguage: authUser?.nativeLanguage || "",
  learningLanguage: authUser?.learningLanguage || "",
  location: authUser?.location || "",
  profilePic: authUser?.profilePic || DEFAULT_AVATAR,
});

useEffect(() => {
  if (!authUser) return;

  setFormState({
    fullName: authUser.fullName || "",
    bio: authUser.bio || "",
    nativeLanguage: authUser.nativeLanguage || "",
    learningLanguage: authUser.learningLanguage || "",
    location: authUser.location || "",
    profilePic: authUser.profilePic || DEFAULT_AVATAR,
  });
}, [authUser]);



  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully 🎉");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

const handleRandomAvatar = () => {
  const idx = Math.floor(Math.random() * 1000) + 1;
  const randomAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=random-${idx}`;
  console.log("Random avatar URL:", randomAvatar);
  setFormState((prev) => ({ ...prev, profilePic: randomAvatar }));
  toast.success("Random profile picture generated!");
};


  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <Toaster position="top-center" />

      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Complete Your Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ── Profile Picture ───────────────────── */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 rounded-full bg-base-300 overflow-hidden border border-gray-300">
                {formState.profilePic ? (
                  <img
                    key={formState.profilePic}
                    src={formState.profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("Image failed to load:", e.target.src);
                      e.target.src = DEFAULT_AVATAR;
                      toast.error("Failed to load avatar image. Showing default.");
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleRandomAvatar}
                className="btn btn-accent flex items-center gap-2"
              >
                <ShuffleIcon className="size-4" />
                Generate Random Avatar
              </button>
            </div>

            {/* ── Full Name ─────────────────────────── */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                value={formState.fullName}
                onChange={(e) =>
                  setFormState((p) => ({ ...p, fullName: e.target.value }))
                }
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>

            {/* ── Bio ───────────────────────────────── */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                value={formState.bio}
                onChange={(e) =>
                  setFormState((p) => ({ ...p, bio: e.target.value }))
                }
                className="textarea textarea-bordered h-24"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </div>

            {/* ── Languages ─────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Native */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                <select
                  value={formState.nativeLanguage}
                  onChange={(e) =>
                    setFormState((p) => ({ ...p, nativeLanguage: e.target.value }))
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* Learning */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>
                <select
                  value={formState.learningLanguage}
                  onChange={(e) =>
                    setFormState((p) => ({ ...p, learningLanguage: e.target.value }))
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select language you're learning</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ── Location ─────────────────────────── */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  value={formState.location}
                  onChange={(e) =>
                    setFormState((p) => ({ ...p, location: e.target.value }))
                  }
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* ── Submit ───────────────────────────── */}
            <button
              className="btn btn-primary w-full"
              disabled={isPending}
              type="submit"
            >
              {isPending ? (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              ) : (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
