'use client';

import React from 'react';
import { DailyContribution } from "../actions";
import { addDays, format, getDay, parseISO, startOfMonth, subMonths } from "date-fns";
import { ja } from "date-fns/locale";
import { useMemo } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ContributionGraphProps {
  contributions: DailyContribution[];
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'] as const;

export function ContributionGraph({ contributions }: ContributionGraphProps) {
  // 過去12ヶ月分のデータを生成
  const { days, weeks, monthLabels } = useMemo(() => {
    const endDate = new Date();
    const startDate = subMonths(endDate, 12);
    const dates = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      dates.push(format(currentDate, 'yyyy-MM-dd'));
      currentDate = addDays(currentDate, 1);
    }

    // 日付を週ごとにグループ化
    const weekGroups: string[][] = [];
    let currentWeek: string[] = [];
    let currentWeekDay = getDay(parseISO(dates[0]));

    // 最初の週の埋め合わせ
    for (let i = 0; i < currentWeekDay; i++) {
      currentWeek.push('');
    }

    dates.forEach(date => {
      currentWeek.push(date);
      if (currentWeek.length === 7) {
        weekGroups.push(currentWeek);
        currentWeek = [];
      }
    });

    // 最後の週の埋め合わせ
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push('');
      }
      weekGroups.push(currentWeek);
    }

    // 月のラベルと位置を計算
    const labels: { text: string; index: number }[] = [];
    let lastMonth = -1;

    weekGroups.forEach((week, weekIndex) => {
      const firstValidDate = week.find(date => date !== '');
      if (firstValidDate) {
        const month = parseISO(firstValidDate).getMonth();
        if (month !== lastMonth) {
          labels.push({
            text: format(parseISO(firstValidDate), 'MMM', { locale: ja }),
            index: weekIndex,
          });
          lastMonth = month;
        }
      }
    });

    return { days: dates, weeks: weekGroups, monthLabels: labels };
  }, []);

  // 日付ごとの投稿数をマッピング
  const contributionMap = useMemo(() => {
    const map = new Map<string, number>();
    contributions.forEach(({ date, count }) => {
      map.set(date, count);
    });
    return map;
  }, [contributions]);

  // 投稿数に応じた色を返す
  const getColor = (count: number) => {
    if (count === 0) return 'bg-muted hover:bg-muted/80';
    if (count <= 2) return 'bg-emerald-200 hover:bg-emerald-300 dark:bg-emerald-900 dark:hover:bg-emerald-800';
    if (count <= 4) return 'bg-emerald-300 hover:bg-emerald-400 dark:bg-emerald-800 dark:hover:bg-emerald-700';
    if (count <= 6) return 'bg-emerald-400 hover:bg-emerald-500 dark:bg-emerald-700 dark:hover:bg-emerald-600';
    return 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500';
  };

  return (
    <div className="space-y-2">
      <div className="relative pl-8">
        <div className="flex mb-2 text-sm text-muted-foreground">
          {monthLabels.map((label, index) => (
            <div
              key={`${label.text}-${label.index}`}
              className="absolute"
              style={{ left: `${label.index * 1.5}rem` }}
            >
              {label.text}
            </div>
          ))}
        </div>
        <div className="flex">
          <div className="grid gap-1 pr-2">
            {WEEKDAYS.map((day) => (
              <div key={day} className="text-sm text-muted-foreground h-5 flex items-center">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-rows-7 grid-flow-col gap-1">
            {weeks.map((week, weekIndex) => (
              <React.Fragment key={weekIndex}>
                {week.map((date, dayIndex) => {
                  if (!date) return <div key={`empty-${weekIndex}-${dayIndex}`} className="w-5 h-5" />;
                  
                  const count = contributionMap.get(date) || 0;
                  return (
                    <TooltipProvider key={date}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`w-5 h-5 rounded-sm transition-colors ${getColor(count)}`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{format(parseISO(date), 'yyyy年M月d日', { locale: ja })}</p>
                          <p>{count}件の投稿</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 pt-4">
          <span className="text-sm text-muted-foreground">Less</span>
          <div className="flex gap-1">
            {[0, 2, 4, 6, 8].map((count) => (
              <div
                key={count}
                className={`w-5 h-5 rounded-sm ${getColor(count)}`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">More</span>
        </div>
      </div>
    </div>
  );
}
