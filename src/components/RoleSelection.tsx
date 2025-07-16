import { UserRole } from '@/schemas/IUserSchema';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface RoleSelectionProps {
  selectedRole?: UserRole;
  onSelect: (role: UserRole) => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({
  selectedRole,
  onSelect,
}) => {
  const roles = Object.values(UserRole);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select your role</Text>
      <View style={styles.rolesContainer}>
        {roles.map(role => {
          const isSelected = role === selectedRole;
          return (
            <TouchableOpacity
              key={role}
              style={[
                styles.roleButton,
                isSelected && styles.selectedRoleButton,
              ]}
              onPress={() => onSelect(role)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.roleText, isSelected && styles.selectedRoleText]}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default RoleSelection;

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 8,
  },
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  roleButton: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedRoleButton: {
    backgroundColor: '#6200EE',
    borderColor: '#6200EE',
  },
  roleText: {
    color: '#444',
    fontSize: 14,
  },
  selectedRoleText: {
    color: '#fff',
    fontWeight: '700',
  },
});
