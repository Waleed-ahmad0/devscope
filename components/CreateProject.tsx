"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
interface dummypro {
  name: string;
  team: string;
  description: string;
}
interface members {
  user: string;
  role: string;
}
interface teamformat {
  _id: string;
  name: string;
  ownerId: string;
  members: members[];
}
export default function CreateProject({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) {
  const [teamname, setteamname] = useState<teamformat[]>([]);
  const {data:session}=useSession()
  const [formData, setFormData] = useState<dummypro>({
    name: "",
    team: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    description: "",
  });
  useEffect(() => {
    const getusrteam = async () => {
      const teamreq = await fetch("/api/teams");
      const data = await teamreq.json();
      // console.log("dddata", data);
      setteamname(data);
    };
    getusrteam();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors = {
      name: formData.name.trim() === "" ? "Name is required" : "",
      description:
        formData.description.trim() === "" ? "Description is required" : "",
    };

    setErrors(newErrors);

    if (!newErrors.name && !newErrors.description) {
      console.log("Form submitted:", formData);
      const senddata = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const response = await senddata.json();
      // console.log(response);
      setFormData({ name: "", description: "", team: "" });
      setIsOpen(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div
      className={`min-h-screen z-100 absolute right-20 top-20   bg-white dark:bg-slate-900 dark:bg-slate-900 ${isOpen ? "flex" : "hidden"} items-center justify-center p-4`}
    >
      <div className="w-full max-w-md">
        <div className="bg-linear-to-br from-blue-50 to-white rounded-2xl shadow-xl border border-blue-100 p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-2">
              Get Started
            </h2>
            <p className="text-blue-600">Fill in your information below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-blue-900"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 bg-white dark:bg-slate-900 dark:bg-slate-900 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name
                    ? "border-red-300 focus:ring-red-500"
                    : "border-blue-200 hover:border-blue-300"
                }`}
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="shrink-0">⚠</span>
                  <span>{errors.name}</span>
                </p>
              )}
            </div>
            <label htmlFor="team">Select team</label>
            <select
              name="team"
              id="team"
              value={formData.team}
              onChange={handleChange}
              className="px-3 py-2.5 rounded-lg border-2 border-blue-200 hover:border-blue-300 bg-white dark:bg-slate-900 dark:bg-slate-900 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="" disabled>
                Select a team
              </option>
              {teamname.map((team: teamformat) => (
                <option disabled={team.ownerId!==session?.user?.id} key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>
            {/* Description Input */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-blue-900"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 bg-white dark:bg-slate-900 dark:bg-slate-900 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.description
                    ? "border-red-300 focus:ring-red-500"
                    : "border-blue-200 hover:border-blue-300"
                }`}
                placeholder="Enter a description"
              />
              {errors.description && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="shrink-0">⚠</span>
                  <span>{errors.description}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
