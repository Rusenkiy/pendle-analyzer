"use client";

import React, { useState } from "react";

export type NetworkName = "ethereum" | "arbitrum" | "mantle";

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
  marketContract: "0x36d3ca43ae7939645c306e26603ce16e39a89192",
  ytContract: "0xeb993b610b68f2631f70ca1cf4fe651db81f368e",
  startTime: "2023-01-01T00:00",
  underlyingAmount: 1.0,
  pointsPerHourPerUnderlying: 0.04,
  pendleMultiplier: 5,
};

export default function InputForm({ onSubmit }: InputFormProps) {
  const [inputs, setInputs] = useState<StrategyInputs>(DEFAULT_INPUTS);

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
          Configure Strategy Parameters
        </span>
      </div>

      <div className="space-y-4">
        {/* Network Selection */}
        <div>
          <label
            htmlFor="network"
            className="block text-[10px] tracking-widest text-brand-green uppercase mb-1 font-bold"
          >
            [01 // NETWORK]
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
          </select>
        </div>

        {/* Market Contract Address */}
        <div>
          <label
            htmlFor="marketContract"
            className="block text-[10px] tracking-widest text-brand-green uppercase mb-1 font-bold"
          >
            [02 // MARKET_CONTRACT]
          </label>
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
          <label
            htmlFor="ytContract"
            className="block text-[10px] tracking-widest text-brand-green uppercase mb-1 font-bold"
          >
            [03 // YT_CONTRACT]
          </label>
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
          <label
            htmlFor="startTime"
            className="block text-[10px] tracking-widest text-brand-green uppercase mb-1 font-bold"
          >
            [04 // START_TIME]
          </label>
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
            <label
              htmlFor="underlyingAmount"
              className="block text-[9px] tracking-wider text-brand-green uppercase mb-1 font-bold"
            >
              [05 // AMOUNT]
            </label>
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
            <label
              htmlFor="pointsPerHourPerUnderlying"
              className="block text-[9px] tracking-wider text-brand-green uppercase mb-1 font-bold"
            >
              [06 // PTS_RATE]
            </label>
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
            <label
              htmlFor="pendleMultiplier"
              className="block text-[9px] tracking-wider text-brand-green uppercase mb-1 font-bold"
            >
              [07 // MULTIPLIER]
            </label>
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
          EXECUTE_STRATEGY_RUN.EXE
        </button>
      </div>
    </form>
  );
}
