import {
  Calendar as CustomCalendar,
  LocaleConfig,
  DateData,
} from 'react-native-calendars';
import { Feather } from '@expo/vector-icons';
import { useTheme } from 'styled-components';
import { ptBR } from './localeConfig';
import { DayProps } from 'react-native-calendars/src/calendar/day';
import { generateInterval } from './generalInterval';

LocaleConfig.locales['pt-br'] = ptBR;
LocaleConfig.defaultLocale = 'pt-br';

interface MarkedDateProps {
  [date: string]: {
    color: string;
    textColor: string;
    disabled?: boolean;
    disableTouchEvent?: boolean;
  };
}

interface CalendarCompProps {
  markedDates: MarkedDateProps;
  onDayPress?: (date: DateData) => void | undefined;
}

function Calendar({ markedDates, onDayPress }: CalendarCompProps) {
  const theme = useTheme();

  return (
    <CustomCalendar
      testID="Calendar"
      renderArrow={(direction) => (
        <Feather
          size={24}
          color={theme.colors.text}
          name={direction === 'left' ? 'chevron-left' : 'chevron-right'}
        />
      )}
      headerStyle={{
        backgroundColor: theme.colors.background_secondary,
        borderBottomWidth: 0.5,
        borderBottomColor: theme.colors.text_detail,
        paddingBottom: 10,
        marginBottom: 10,
      }}
      theme={{
        textDayFontFamily: theme.fonts.primary_400,
        textDayHeaderFontFamily: theme.fonts.primary_500,
        textDayHeaderFontSize: 10,
        textMonthFontFamily: theme.fonts.secondary_600,
        textMonthFontSize: 20,
        monthTextColor: theme.colors.title,
        arrowStyle: {
          marginHorizontal: -15,
        },
      }}
      firstDay={1}
      minDate={String(new Date())}
      markedDates={markedDates}
      onDayPress={onDayPress}
      markingType="period"
    />
  );
}

export { Calendar, DayProps, MarkedDateProps, DateData, generateInterval };
