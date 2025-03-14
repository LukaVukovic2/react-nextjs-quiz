"use client";
import ReactTimeAgo from 'react-time-ago';
import TimeAgo from 'javascript-time-ago';

import en from 'javascript-time-ago/locale/en.json';

TimeAgo.addDefaultLocale(en);

export default function TimeAgoComponent({date}: {date: Date}) {
  return <ReactTimeAgo date={date} locale='en-US' suppressHydrationWarning />
}