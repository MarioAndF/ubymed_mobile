import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';


interface DateTimeTableProps {
  initialDate: Date;
  onDateChange: (date: Date) => void; // Añadimos esta prop para manejar el cambio de fecha/hora
}

export const DateTimeTable: React.FC<DateTimeTableProps> = ({ initialDate, onDateChange }) => {
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialDate);

  const onChangeDate = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    const updatedDateTime = new Date(currentDate);
    updatedDateTime.setHours(time.getHours());
    updatedDateTime.setMinutes(time.getMinutes());
    onDateChange(updatedDateTime); // Llama al callback con la nueva fecha y hora
  };

  const onChangeTime = (event: any, selectedTime: Date | undefined) => {
    const currentTime = selectedTime || time;
    setTime(currentTime);
    const updatedDateTime = new Date(date);
    updatedDateTime.setHours(currentTime.getHours());
    updatedDateTime.setMinutes(currentTime.getMinutes());
    onDateChange(updatedDateTime); // Llama al callback con la nueva fecha y hora
  };

  useEffect(() => {
    onDateChange(date); // Inicialmente, pasa la fecha inicial al componente padre
  }, []);

  return (
    <View style={simpleTableStyles.table}>
      <View style={[simpleTableStyles.row, simpleTableStyles.rowWithBorder]}>
        <Text style={simpleTableStyles.firstCell}>Fecha</Text>
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      </View>
      <View style={simpleTableStyles.row}>
        <Text style={simpleTableStyles.firstCell}>Hora</Text>
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={onChangeTime}
        />
      </View>
    </View>
  );
};

interface SimpleTableProps {
  data: any[];
}

export const SimpleTable: React.FC<SimpleTableProps> = ({ data }) => {
  return (
    <View style={simpleTableStyles.table}>
      {data.map((row, rowIndex) => (
        <View 
          key={rowIndex} 
          style={[
            simpleTableStyles.row, 
            rowIndex < data.length - 1 ? simpleTableStyles.rowWithBorder : {}
          ]}
        >
          {Object.values(row).map((cell, cellIndex) => (
            <Text key={cellIndex} style={cellIndex === 0 ? simpleTableStyles.firstCell : simpleTableStyles.secondCell}>
              {String(cell)}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
};

interface EditableTableProps {
  data: { label: string; value: string }[];
  onDataChange: (data: { label: string; value: string }[]) => void;
}

export const EditableTable: React.FC<EditableTableProps> = ({ data, onDataChange }) => {
  const [inputValues, setInputValues] = React.useState<string[]>(data.map(item => item.value));

  // Solo actualiza inputValues si data cambia y es diferente de la anterior
  React.useEffect(() => {
    const newValues = data.map(item => item.value);
    if (JSON.stringify(inputValues) !== JSON.stringify(newValues)) {
      setInputValues(newValues);
    }
  }, [data]);

  // Solo llama a onDataChange cuando inputValues cambia
  React.useEffect(() => {
    const updatedData = data.map((item, index) => ({
      label: item.label,
      value: inputValues[index],
    }));
    onDataChange(updatedData);
  }, [inputValues]);

  const handleTextChange = (text: string, index: number) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = text;
    setInputValues(newInputValues);
  };

  return (
    <View style={simpleTableStyles.table}>
      {data.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={[
            simpleTableStyles.row,
            rowIndex < data.length - 1 ? simpleTableStyles.rowWithBorder : {}
          ]}
        >
          <Text style={simpleTableStyles.firstCell}>{row.label}</Text>
          <TextInput
            style={simpleTableStyles.secondCell}
            value={inputValues[rowIndex]}
            onChangeText={(text) => handleTextChange(text, rowIndex)}
          />
        </View>
      ))}
    </View>
  );
};

interface CheckboxProps {
  isSelected: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ isSelected }) => (
  <View style={singleSelectTableStyles.checkbox}>
    {isSelected && <View style={singleSelectTableStyles.checkmark} />}
  </View>
);

interface SingleSelectTableProps extends SimpleTableProps {
  onRowSelect: (id: string) => void;
}

export const SingleSelectTable: React.FC<SingleSelectTableProps> = ({ data, onRowSelect }) => {
  const [selectedRow, setSelectedRow] = React.useState<string | null>(null);

  const handleRowPress = (id: string) => {
    setSelectedRow(selectedRow === id ? null : id);
    onRowSelect(id);
  };

  return (
    <View style={singleSelectTableStyles.table}>
      {data.map((row: any, index) => (
        <Pressable 
          key={row.id} 
          style={[
            singleSelectTableStyles.row, 
            index < data.length - 1 ? singleSelectTableStyles.rowWithBorder : {}
          ]}
          onPress={() => handleRowPress(row.id)}
        >
          <Checkbox isSelected={selectedRow === row.id} />
          <Text style={singleSelectTableStyles.cell}>{row.name}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const simpleTableStyles = StyleSheet.create({
  table: {
    marginLeft: 24,
    marginRight: 24,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  rowWithBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#c6c6c6',
  },
  firstCell: {
    flex: 1,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  secondCell: {
    flex: 2,
    textAlign: 'right',
  },
});

const singleSelectTableStyles = StyleSheet.create({
  table: {
    marginLeft: 24,
    marginRight: 24,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: '#FFFFFF', // Color de fondo blanco
    borderRadius: 16, // Bordes redondeados
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16, // Padding para la fila
  },
  rowWithBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#c6c6c6',
  },
  cell: {
    marginLeft: 10,
    textAlign: 'left', // Alinear texto a la izquierda
  },
  checkbox: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#009aef',
  },
});