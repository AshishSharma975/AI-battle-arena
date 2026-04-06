import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, CheckCircle2, ChevronRight, User, Loader2, Sparkles } from 'lucide-react';

export const MessageBubble = ({ problem }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-gray-50/80 border border-gray-100 px-8 py-6 rounded-xl w-full max-w-2xl text-left shadow-sm">
        <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-3 block">User Prompt</span>
        <div className="text-[15px] leading-relaxed text-gray-800 font-medium">
          <div className="prose prose-sm max-w-none"><ReactMarkdown>{problem}</ReactMarkdown></div>
        </div>
      </div>
    </div>
  );
};

export const ComparisonView = ({ loading, solution_1, solution_2, judge }) => {
  if (loading) {
    return (
      <div className="w-full flex flex-col items-center mb-24 animate-in fade-in duration-500">
        <div className="flex items-center gap-3 text-indigo-500 font-medium py-12 mt-4">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="animate-pulse flex items-center gap-2">Running models and evaluating <Sparkles className="w-4 h-4"/></span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center mb-24 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Solutions Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 w-full max-w-4xl">
        
        {/* Solution 1 */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden flex flex-col p-6 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 text-gray-800 font-semibold mb-4 border-b border-gray-50 pb-3">
            <span className="bg-gray-100 p-1 rounded-sm"><Bot className="w-3.5 h-3.5 text-gray-600" /></span>
            <span>Solution 1</span>
          </div>
          <div className="flex-1 prose prose-sm prose-gray max-w-none text-gray-600 text-[13px] leading-relaxed">
            <ReactMarkdown>{solution_1}</ReactMarkdown>
          </div>
        </div>

        {/* Solution 2 */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden flex flex-col p-6 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 text-gray-800 font-semibold mb-4 border-b border-gray-50 pb-3">
            <span className="bg-gray-100 p-1 rounded-sm"><Bot className="w-3.5 h-3.5 text-gray-600" /></span>
            <span>Solution 2</span>
          </div>
          <div className="flex-1 prose prose-sm prose-gray max-w-none text-gray-600 text-[13px] leading-relaxed">
            <ReactMarkdown>{solution_2}</ReactMarkdown>
          </div>
        </div>

      </div>

      {/* Judge Panel */}
      <div className="w-full max-w-4xl bg-gray-50/50 border border-gray-100 rounded-xl p-6 flex flex-col md:flex-row gap-8">
        
        {/* Assessment Score */}
        <div className="md:w-1/3 border-r border-gray-200/60 pr-6">
          <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-4 block">Assessment Score</span>
          
          <div className="mb-4">
            <div className="flex justify-between items-end mb-1">
              <span className="text-sm font-medium text-gray-600">Solution 1</span>
              <span className="text-xl font-semibold text-gray-900">{judge.solution_1}</span>
            </div>
            <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
              <div className="bg-gray-800 h-full" style={{ width: `${(judge.solution_1 / 10) * 100}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-end mb-1">
              <span className="text-sm font-medium text-gray-400">Solution 2</span>
              <span className="text-lg font-medium text-gray-500">{judge.solution_2}</span>
            </div>
            <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
              <div className="bg-gray-400 h-full" style={{ width: `${(judge.solution_2 / 10) * 100}%` }}></div>
            </div>
          </div>
        </div>
        
        {/* Judge Reasoning */}
        <div className="md:w-2/3">
          <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-3 block">Judge Reasoning</span>
          <h4 className="text-lg font-bold text-gray-800 mb-2">{judge.winner === 'Solution 1' ? 'Solution 1 is superior.' : 'Solution 2 is superior.'}</h4>
          <p className="text-[13px] text-gray-600 leading-relaxed mb-3">
            {judge.winner === 'Solution 1' ? judge.solution_1_reasoning : judge.solution_2_reasoning}
          </p>
          <p className="text-[13px] text-gray-500 leading-relaxed">
            {judge.winner === 'Solution 1' ? judge.solution_2_reasoning : judge.solution_1_reasoning}
          </p>
        </div>

      </div>
    </div>
  );
};

