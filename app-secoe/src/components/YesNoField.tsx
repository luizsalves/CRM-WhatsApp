import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme/colors';
import { YesNo, YesNoNA } from '../types/models';
import { RadioOption } from './RadioOption';

interface Props {
  question: string;
  value: YesNo;
  onChange: (value: YesNo) => void;
  showNaoAplicavel?: false;
}

interface PropsNA {
  question: string;
  value: YesNoNA;
  onChange: (value: YesNoNA) => void;
  showNaoAplicavel: true;
}

export function YesNoField(props: Props | PropsNA) {
  const { question, value, onChange, showNaoAplicavel } = props;
  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      <View style={styles.options}>
        <RadioOption
          label="Sim"
          selected={value === 'sim'}
          onPress={() => onChange('sim' as never)}
        />
        <RadioOption
          label="Não"
          selected={value === 'nao'}
          onPress={() => onChange('nao' as never)}
        />
        {showNaoAplicavel ? (
          <RadioOption
            label="Não aplicável"
            selected={value === 'nao_aplicavel'}
            onPress={() => onChange('nao_aplicavel' as never)}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  question: {
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
