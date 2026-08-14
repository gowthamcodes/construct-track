import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants';

export default function SummaryCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: '47%',
    padding: 16,
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.BLUE_LIGHT,
  },
  title: { fontSize: 13, color: Colors.SECONDARY, marginBottom: 8 },
  value: { fontSize: 21, fontWeight: '700', color: Colors.PRIMARY },
  subtitle: { marginTop: 6, fontSize: 12, color: Colors.SECONDARY },
});
