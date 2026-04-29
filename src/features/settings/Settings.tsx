import React from 'react';
import { useCurrency } from '../../lib/CurrencyContext';
import { useTheme, Theme } from '../../lib/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Settings, Globe, Wallet, Bell, Palette } from 'lucide-react';

export default function SettingsPage() {
  const { currency, setCurrency, currencies } = useCurrency();
  const { theme, setTheme } = useTheme();

  const themes: { id: Theme; label: string; color: string }[] = [
    { id: 'light', label: 'Light', color: 'bg-white border-zinc-200' },
    { id: 'dark', label: 'Dark', color: 'bg-zinc-900 border-zinc-800' },
    { id: 'indigo', label: 'Indigo', color: 'bg-indigo-600 border-indigo-500' },
    { id: 'rose', label: 'Rose', color: 'bg-rose-600 border-rose-500' },
    { id: 'emerald', label: 'Emerald', color: 'bg-emerald-600 border-emerald-500' },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <Settings className="w-6 h-6 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900">Settings</h1>
      </div>

      <div className="grid gap-6 text-left">
        {/* Appearance */}
        <Card className="border-zinc-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-zinc-500" />
              <CardTitle className="text-lg">Appearance</CardTitle>
            </div>
            <CardDescription>Customize how the application looks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <Label>Theme</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      theme === t.id
                        ? 'border-indigo-600 bg-indigo-50/50'
                        : 'border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    <div className={`w-full h-12 rounded-lg border ${t.color}`} />
                    <span className="text-sm font-medium">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Localization & Regional */}
        <Card className="border-zinc-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-zinc-500" />
              <CardTitle className="text-lg">Localization</CardTitle>
            </div>
            <CardDescription>Manage your regional and language preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="currency">Base Currency</Label>
              <Select value={currency.code} onValueChange={setCurrency}>
                <SelectTrigger id="currency" className="w-full sm:w-[300px]">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.label} ({c.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-zinc-500">This currency will be used for all financial calculations and reports.</p>
            </div>
          </CardContent>
        </Card>

        {/* Company Settings */}
        <Card className="border-zinc-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-zinc-500" />
              <CardTitle className="text-lg">Company Information</CardTitle>
            </div>
            <CardDescription>General information about your organization.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" placeholder="Acme Corp" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                <Input id="taxId" placeholder="US123456789" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Billing Email</Label>
              <Input id="email" type="email" placeholder="billing@company.com" />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-zinc-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-zinc-500" />
              <CardTitle className="text-lg">Notifications</CardTitle>
            </div>
            <CardDescription>Manage how you receive alerts and updates.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
              <div>
                <p className="font-medium text-zinc-900">Low Stock Alerts</p>
                <p className="text-sm text-zinc-500">Notify when products go below minimum threshold</p>
              </div>
              <Button variant="outline" size="sm">Enabled</Button>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0 pt-4">
              <div>
                <p className="font-medium text-zinc-900">Procurement Updates</p>
                <p className="text-sm text-zinc-500">Notify when purchase orders are approved or received</p>
              </div>
              <Button variant="outline" size="sm">Enabled</Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline">Reset to Defaults</Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
