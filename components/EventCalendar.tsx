
import React from 'react';
import { EVENTS } from '../constants';
import { Card } from './common/Card';
import { CalendarIcon } from './icons/Icons';

export const EventCalendar: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-amber-900 mb-6 text-center">イベントカレンダー</h2>
      <div className="space-y-6">
        {EVENTS.map(event => (
          <Card key={event.id}>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-amber-900 mb-2">{event.title}</h3>
                <div className="flex items-center text-stone-600 mb-3">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  <span>{event.date}</span>
                </div>
                <p className="text-stone-700">{event.description}</p>
              </div>
              <div className="flex-shrink-0 flex flex-col justify-center items-center md:items-end">
                <p className="text-sm font-medium text-stone-600 mb-2">{event.location}</p>
                <button className="bg-amber-600 text-white font-bold py-2 px-6 rounded-full hover:bg-amber-700 transition-transform hover:scale-105">
                  参加予約
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
