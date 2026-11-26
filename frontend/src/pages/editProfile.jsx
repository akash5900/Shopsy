import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserRound, ArrowLeft, Save } from "lucide-react";
import useAuth from "../context/useAuth";

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, loading, fetchUser } = useAuth();

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    mobilenumber: user?.mobilenumber || "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const res = await fetch("/api/user/profile/edit", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: String(formData.username).trim(),
          email: String(formData.email).trim(),
          mobilenumber: String(formData.mobilenumber).trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setSuccess("Profile updated successfully!");

      await fetchUser();

      navigate("/profile", {
        state: { updatedUser: data.user },
      });
    } catch (err) {
      setError(
        err.message || "Unable to update your profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mt-20 text-center text-gray-500">Loading profile...</div>
    );
  }

  if (!user) {
    return (
      <div className="mt-20 text-center text-gray-600">
        Please log in to edit your profile.
        <div className="mt-4">
          <Link to="/login" className="text-blue-600 underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:pt-6 2xl:pt-30 pb-10">
      <div className="mx-auto max-w-lg">
        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="mb-5 flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back to Profile
        </button>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <UserRound size={26} />
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Edit Profile
                </h1>
                <p className="text-sm text-gray-500">
                  Update your account information
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8">
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>

              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                pattern="[A-Za-z]+( [A-Za-z]+)*"
                title="Name can contain only letters and spaces"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="mobilenumber"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Mobile Number
              </label>

              <input
                id="mobilenumber"
                name="mobilenumber"
                type="tel"
                value={formData.mobilenumber}
                onChange={handleChange}
                required
                pattern="[6-9][0-9]{9}"
                maxLength={10}
                title="Enter a valid 10-digit mobile number"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
              >
                {error}
              </p>
            )}

            {success && (
              <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                {success}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex-1 rounded-lg border border-gray-300 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
