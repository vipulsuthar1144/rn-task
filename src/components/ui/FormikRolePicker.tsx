// components/ui/FormikRolePicker.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useField } from 'formik';
import { UserRole } from '@/schemas/IUserSchema';

interface FormikRolePickerProps {
  name: string;
  label: string;
}

const FormikRolePicker: React.FC<FormikRolePickerProps> = ({ name, label }) => {
  const [field, meta, helpers] = useField(name);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Picker
        selectedValue={field.value}
        onValueChange={value => helpers.setValue(value)}
        style={styles.picker}
      >
        {Object.values(UserRole).map(role => (
          <Picker.Item
            key={role}
            label={role.charAt(0).toUpperCase() + role.slice(1)}
            value={role}
          />
        ))}
      </Picker>
      {meta.touched && meta.error ? (
        <Text style={styles.error}>{meta.error}</Text>
      ) : null}
    </View>
  );
};

export default FormikRolePicker;

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
  },
  picker: {
    height: 'auto',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});
