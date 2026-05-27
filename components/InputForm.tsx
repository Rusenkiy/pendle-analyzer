"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

export type NetworkName = "ethereum" | "arbitrum" | "mantle" | "bnb" | "optimism" | "base" | "avalanche";

export interface StrategyInputs {
  network: NetworkName;
  marketContract: string;
  ytContract: string;
  startTime: string;
  underlyingAmount: number;
  pointsPerHourPerUnderlying: number;
  pendleMultiplier: number;
}

interface InputFormProps {
  onSubmit?: (inputs: StrategyInputs) => void;
}

const DEFAULT_INPUTS: StrategyInputs = {
  network: "ethereum",
  marketContract: "0x34280882267ffa6383b363e278b027be083bbe3b",
  ytContract: "0x04b7fa1e727d7290d6e24fa9b426d0c940283a95",
  startTime: "2026-03-29T00:00",
  underlyingAmount: 1.0,
  pointsPerHourPerUnderlying: 0.04,
  pendleMultiplier: 5,
};

export default function InputForm({ onSubmit }: InputFormProps) {
  const [inputs, setInputs] = useState<StrategyInputs>(DEFAULT_INPUTS);
  const [activeHelp, setActiveHelp] = useState<"marketContract" | "ytContract" | "startTime" | "amount" | "ptsRate" | "multiplier" | null>(null);
  const { t } = useLanguage();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Parse numeric fields properly
    if (
      name === "underlyingAmount" ||
      name === "pointsPerHourPerUnderlying" ||
      name === "pendleMultiplier"
    ) {
      setInputs((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setInputs((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Strategy Inputs:", inputs);
    if (onSubmit) {
      onSubmit(inputs);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-2 border-dark-border bg-dark-card p-6 rounded-none w-full max-w-xl font-mono text-slate-200"
    >
      <div className="flex items-center gap-2 mb-6 border-b border-dark-border pb-3">
        <span className="h-1.5 w-1.5 bg-brand-green"></span>
        <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
          {t("form.title")}
        </span>
      </div>

      <div className="space-y-4">
        {/* Network Selection */}
        <div>
          <label
            htmlFor="network"
            className="block text-[10px] tracking-widest text-brand-green uppercase mb-1 font-bold"
          >
            {t("form.network")}
          </label>
          <select
            id="network"
            name="network"
            value={inputs.network}
            onChange={handleChange}
            className="bg-black border border-dark-border text-white rounded-none p-2.5 font-mono text-sm focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green w-full transition-colors cursor-pointer"
          >
            <option value="ethereum">Ethereum Mainnet</option>
            <option value="arbitrum">Arbitrum One</option>
            <option value="mantle">Mantle Network</option>
            <option value="bnb">BNB Chain</option>
            <option value="optimism">Optimism</option>
            <option value="base">Base</option>
            <option value="avalanche">Avalanche C-Chain</option>
          </select>
        </div>

        {/* Market Contract Address */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="marketContract"
              className="block text-[10px] tracking-widest text-brand-green uppercase font-bold"
            >
              {t("form.market_contract")}
            </label>
            <button
              type="button"
              onClick={() => setActiveHelp("marketContract")}
              className="text-[10px] font-bold text-slate-500 hover:text-brand-green cursor-pointer select-none font-mono"
            >
              [ ? ]
            </button>
          </div>
          <input
            type="text"
            id="marketContract"
            name="marketContract"
            value={inputs.marketContract}
            onChange={handleChange}
            placeholder="0x..."
            required
            className="bg-black border border-dark-border text-white rounded-none p-2.5 font-mono text-sm focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green w-full transition-colors"
          />
        </div>

        {/* YT Contract Address */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="ytContract"
              className="block text-[10px] tracking-widest text-brand-green uppercase font-bold"
            >
              {t("form.yt_contract")}
            </label>
            <button
              type="button"
              onClick={() => setActiveHelp("ytContract")}
              className="text-[10px] font-bold text-slate-500 hover:text-brand-green cursor-pointer select-none font-mono"
            >
              [ ? ]
            </button>
          </div>
          <input
            type="text"
            id="ytContract"
            name="ytContract"
            value={inputs.ytContract}
            onChange={handleChange}
            placeholder="0x..."
            required
            className="bg-black border border-dark-border text-white rounded-none p-2.5 font-mono text-sm focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green w-full transition-colors"
          />
        </div>

        {/* Start Time */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="startTime"
              className="block text-[10px] tracking-widest text-brand-green uppercase font-bold"
            >
              {t("form.start_time")}
            </label>
            <button
              type="button"
              onClick={() => setActiveHelp("startTime")}
              className="text-[10px] font-bold text-slate-500 hover:text-brand-green cursor-pointer select-none font-mono"
            >
              [ ? ]
            </button>
          </div>
          <input
            type="datetime-local"
            id="startTime"
            name="startTime"
            value={inputs.startTime}
            onChange={handleChange}
            required
            className="bg-black border border-dark-border text-white rounded-none p-2.5 font-mono text-sm focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green w-full transition-colors invert-calendar-icon"
          />
        </div>

        {/* Grid for parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Underlying Amount */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="underlyingAmount"
                className="block text-[9px] tracking-wider text-brand-green uppercase font-bold"
              >
                {t("form.amount")}
              </label>
              <button
                type="button"
                onClick={() => setActiveHelp("amount")}
                className="text-[9px] font-bold text-slate-500 hover:text-brand-green cursor-pointer select-none font-mono"
              >
                [ ? ]
              </button>
            </div>
            <input
              type="number"
              id="underlyingAmount"
              name="underlyingAmount"
              value={inputs.underlyingAmount}
              onChange={handleChange}
              step="any"
              min="0"
              required
              className="bg-black border border-dark-border text-white rounded-none p-2.5 font-mono text-sm focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green w-full transition-colors"
            />
          </div>

          {/* Points Per Hour Per Underlying */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="pointsPerHourPerUnderlying"
                className="block text-[9px] tracking-wider text-brand-green uppercase font-bold"
              >
                {t("form.pts_rate")}
              </label>
              <button
                type="button"
                onClick={() => setActiveHelp("ptsRate")}
                className="text-[9px] font-bold text-slate-500 hover:text-brand-green cursor-pointer select-none font-mono"
              >
                [ ? ]
              </button>
            </div>
            <input
              type="number"
              id="pointsPerHourPerUnderlying"
              name="pointsPerHourPerUnderlying"
              value={inputs.pointsPerHourPerUnderlying}
              onChange={handleChange}
              step="any"
              min="0"
              required
              className="bg-black border border-dark-border text-white rounded-none p-2.5 font-mono text-sm focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green w-full transition-colors"
            />
          </div>

          {/* Pendle Multiplier */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="pendleMultiplier"
                className="block text-[9px] tracking-wider text-brand-green uppercase font-bold"
              >
                {t("form.multiplier")}
              </label>
              <button
                type="button"
                onClick={() => setActiveHelp("multiplier")}
                className="text-[9px] font-bold text-slate-500 hover:text-brand-green cursor-pointer select-none font-mono"
              >
                [ ? ]
              </button>
            </div>
            <input
              type="number"
              id="pendleMultiplier"
              name="pendleMultiplier"
              value={inputs.pendleMultiplier}
              onChange={handleChange}
              step="any"
              min="0"
              required
              className="bg-black border border-dark-border text-white rounded-none p-2.5 font-mono text-sm focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green w-full transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="pt-6">
        <button
          type="submit"
          className="w-full bg-brand-green hover:bg-brand-green-dim hover:text-brand-green text-black font-extrabold font-mono uppercase py-3.5 rounded-none transition-all duration-300 tracking-widest cursor-pointer border border-brand-green shadow-[4px_4px_0px_0px_rgba(0,255,102,0.15)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
        >
          {t("form.submit")}
        </button>
      </div>

      <HelpModal 
        isOpen={activeHelp === "marketContract"}
        onClose={() => setActiveHelp(null)}
        title="Market Contract Guide"
        content="Paste the Market Contract address here. See reference below:"
        imageSrc="/market-guide.png"
        imageAlt="Market Guide"
      />

      <HelpModal 
        isOpen={activeHelp === "ytContract"}
        onClose={() => setActiveHelp(null)}
        title="YT Contract Guide"
        content="Paste the Yield Token (YT) Contract address here."
        imageSrc="/yt-guide.png"
        imageAlt="YT Guide"
      />

      <HelpModal 
        isOpen={activeHelp === "startTime"}
        onClose={() => setActiveHelp(null)}
        title="Start Time Guide"
        content="Set the strategy start date. Check the Pendle charts for the earliest available data point for the specific pool."
      />

      <HelpModal 
        isOpen={activeHelp === "amount"}
        onClose={() => setActiveHelp(null)}
        title="Amount Guide"
        content="Enter the amount of underlying asset (e.g., ETH) you plan to use to buy YT."
      />

      <HelpModal 
        isOpen={activeHelp === "ptsRate"}
        onClose={() => setActiveHelp(null)}
        title="Points Rate Guide"
        content="Enter the base daily points emission rate for the underlying asset. You must find this value in the protocol's official documentation or Discord."
      />

      <HelpModal 
        isOpen={activeHelp === "multiplier"}
        onClose={() => setActiveHelp(null)}
        title="Multiplier Guide"
        content="Enter the Pendle points multiplier for this specific pool (e.g., 5x, 10x)."
      />
    </form>
  );
}

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  imageSrc?: string;
  imageAlt?: string;
}

function HelpModal({ isOpen, onClose, title, content, imageSrc, imageAlt }: HelpModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xs cursor-pointer" 
        onClick={onClose}
      />
      {/* Dialog container */}
      <div className="relative w-[95%] md:max-w-5xl max-h-[90vh] overflow-y-auto bg-black border-2 border-brand-green p-6 md:p-8 rounded-none shadow-[8px_8px_0px_0px_rgba(0,255,102,0.15)] z-10 font-mono text-slate-200">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-3 mb-4">
          <span className="text-brand-green font-bold uppercase text-[11px] tracking-wider">&gt; {title}</span>
          <button 
            type="button" 
            onClick={onClose}
            className="text-slate-500 hover:text-brand-green transition-colors cursor-pointer text-[10px] font-bold"
          >
            [ X CLOSE ]
          </button>
        </div>
        <p className="text-xs leading-relaxed text-slate-300 mb-4">{content}</p>
        {imageSrc && (
          <div className="border border-brand-green p-1 bg-zinc-950 mt-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={imageSrc} 
              alt={imageAlt || "Help Guide"} 
              className="w-full h-auto object-contain border border-zinc-800" 
            />
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 border border-brand-green text-brand-green hover:bg-brand-green hover:text-black font-extrabold text-[10px] uppercase tracking-wider rounded-none cursor-pointer transition-colors"
          >
            [ DISMISS ]
          </button>
        </div>
      </div>
    </div>
  );
}
