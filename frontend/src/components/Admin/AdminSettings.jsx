import { useEffect, useState } from "react";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    storeName: "",
    adminEmail: "",
    currency: "INR",
  });

  // Load saved settings
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("adminSettings"));
    if (saved) setSettings(saved);
    else {
      setSettings({
        storeName: "Rabbit",
        adminEmail: "sania@rabbit.com",
        currency: "INR",
      });
    }
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const saveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem("adminSettings", JSON.stringify(settings));
    alert("Settings saved successfully ✅");
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <form
        onSubmit={saveSettings}
        className="bg-white rounded-xl border p-6 space-y-4"
      >
        <div>
          <label className="text-sm font-medium block mb-1">
            Store Name
          </label>
          <input
            name="storeName"
            value={settings.storeName}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">
            Admin Email
          </label>
          <input
            name="adminEmail"
            value={settings.adminEmail}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">
            Currency
          </label>
          <select
            name="currency"
            value={settings.currency}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-black text-white px-5 py-2 rounded-lg text-sm"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;
