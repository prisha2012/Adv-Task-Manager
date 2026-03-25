import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, BarChart3, TrendingUp, Sparkles, Zap } from 'lucide-react';

interface TaskStatsProps {
  stats: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
  };
}

export const TaskStats: React.FC<TaskStatsProps> = ({ stats }) => {
  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: BarChart3,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-600',
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'from-blue-400 to-blue-700',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      iconColor: 'text-green-600',
      gradient: 'from-green-500 to-emerald-600',
      hoverGradient: 'from-green-400 to-emerald-700',
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      iconColor: 'text-yellow-600',
      gradient: 'from-yellow-500 to-orange-600',
      hoverGradient: 'from-yellow-400 to-orange-700',
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: AlertTriangle,
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      iconColor: 'text-red-600',
      gradient: 'from-red-500 to-pink-600',
      hoverGradient: 'from-red-400 to-pink-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div
          key={stat.title}
          className={`
            relative ${stat.bgColor} rounded-3xl p-4 sm:p-6 border border-opacity-20 border-gray-300 
            hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-4 hover:rotate-2
            animate-slideUp group overflow-hidden cursor-pointer
            hover:scale-110 backdrop-blur-sm
          `}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Enhanced gradient overlay on hover */}
          <div className={`
            absolute inset-0 bg-gradient-to-br ${stat.hoverGradient} opacity-0 
            transition-all duration-500 group-hover:opacity-20 group-hover:scale-110
          `} />
          
          {/* Multiple shimmer effects */}
          <div className={`
            absolute inset-0 bg-gradient-to-r from-transparent via-white via-transparent to-transparent
            transform -skew-x-12 transition-transform duration-1500
            group-hover:translate-x-full opacity-30
          `} style={{ transform: 'translateX(-100%) skewX(-12deg)' }} />
          
          <div className={`
            absolute inset-0 bg-gradient-to-r from-transparent via-blue-200 to-transparent
            transform -skew-x-12 transition-transform duration-2000 delay-300
            group-hover:translate-x-full opacity-20
          `} style={{ transform: 'translateX(-120%) skewX(-12deg)' }} />
          
          {/* Floating particles */}
          <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-60 group-hover:animate-ping transition-all duration-500" />
          <div className="absolute top-4 right-6 w-0.5 h-0.5 bg-white rounded-full opacity-0 group-hover:opacity-40 group-hover:animate-pulse transition-all duration-700 delay-200" />
          <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-50 group-hover:animate-bounce transition-all duration-600 delay-100" />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-600 mb-2 flex items-center gap-2 transition-all duration-300 group-hover:text-gray-800">
                {stat.title}
                {stat.title === 'Completed' && stats.total > 0 && (
                  <TrendingUp size={12} className="text-green-500 animate-pulse" />
                )}
                {stat.title === 'Total Tasks' && (
                  <Sparkles size={10} className="text-blue-400 animate-spin" />
                )}
                {stat.title === 'Overdue' && stats.overdue > 0 && (
                  <Zap size={10} className="text-red-500 animate-bounce" />
                )}
              </p>
              <p className={`text-2xl sm:text-3xl font-black ${stat.textColor} transition-all duration-500 group-hover:scale-125 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:${stat.gradient} group-hover:bg-clip-text`}>
                {stat.value}
              </p>
              {stat.title === 'Completed' && stats.total > 0 && (
                <p className="text-xs text-gray-500 mt-2 font-bold transition-all duration-300 group-hover:text-gray-700">
                  {completionRate.toFixed(0)}% completion rate
                </p>
              )}
            </div>
            <div className={`
              p-2 sm:p-3 rounded-2xl ${stat.bgColor} transition-all duration-500 
              group-hover:scale-125 group-hover:rotate-12 shadow-xl
              group-hover:shadow-2xl backdrop-blur-sm border border-white/30
              relative overflow-hidden
            `}>
              {/* Icon glow effect */}
              <div className={`
                absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 rounded-2xl blur-md
                transition-opacity duration-500 group-hover:opacity-40
              `} />
              <stat.icon size={20} className={`${stat.iconColor} transition-all duration-500 relative z-10 group-hover:drop-shadow-lg sm:w-6 sm:h-6`} />
            </div>
          </div>
          
          {stat.title === 'Completed' && stats.total > 0 && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                <div
                  className={`
                    bg-gradient-to-r ${stat.gradient} h-3 rounded-full 
                    transition-all duration-1500 ease-out relative overflow-hidden
                    shadow-lg
                  `}
                  style={{ width: `${completionRate}%` }}
                >
                  {/* Multiple animated shine effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200 to-transparent opacity-20 animate-ping" />
                </div>
              </div>
            </div>
          )}
          
          {/* Corner decoration */}
          <div className={`
            absolute top-0 right-0 w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br ${stat.gradient} 
            opacity-10 transform rotate-45 translate-x-6 sm:translate-x-8 -translate-y-6 sm:-translate-y-8
            transition-all duration-500 group-hover:scale-150 group-hover:opacity-20
          `} />
          
          {/* Additional corner sparkle */}
          <div className={`
            absolute bottom-0 left-0 w-8 h-8 bg-gradient-to-tr ${stat.gradient} 
            opacity-5 transform -rotate-45 -translate-x-4 translate-y-4
            transition-all duration-700 group-hover:scale-200 group-hover:opacity-15
          `} />
        </div>
      ))}
    </div>
  );
};