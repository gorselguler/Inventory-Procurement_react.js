/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Bell, Search, User, ChevronDown } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96 group">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
          <input
            type="text"
            placeholder="Search products, suppliers, orders..."
            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 hover:bg-zinc-100 rounded-full transition-colors">
          <Bell size={20} className="text-zinc-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white" />
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-zinc-200">
          <div className="text-right">
            <p className="text-sm font-semibold text-zinc-900 leading-none">User Account</p>
            <p className="text-xs text-zinc-500 mt-1">Administrator</p>
          </div>
          <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center border border-zinc-200 cursor-pointer hover:bg-zinc-200 transition-colors">
            <User size={20} className="text-zinc-600" />
          </div>
          <ChevronDown size={16} className="text-zinc-400" />
        </div>
      </div>
    </header>
  );
}
