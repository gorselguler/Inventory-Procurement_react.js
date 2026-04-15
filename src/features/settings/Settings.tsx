import React from 'react';
import { useCurrency } from '../../lib/CurrencyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Settings, Globe, Wallet, Bell, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { currency, setCurrency, currencies } = useCurrency();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <Settings className="w-6 h-6 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900">Settings</h1>
      </div>

      <div className="grid gap-6 text-left">
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
