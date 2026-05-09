import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useCategories } from '../../hooks/useCategories';
import { useTransactionForm } from '../../hooks/useTransactionForm';
import { useTransactions } from '../../hooks/useTransactions';

export default function TransactionFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === 'new';

  const { transactions, loadTransactions, createTransaction, updateTransaction, getById } = useTransactions();
  const { categories, loadCategories } = useCategories();
  const { values, errors, submitting, setField, reset, handleSubmit } = useTransactionForm();

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        await loadCategories();
        await loadTransactions();
        if (isNew) reset();
      };
      init();
    }, [isNew])
  );

  useEffect(() => {
    if (!isNew && transactions.length > 0) {
      const t = getById(id);
      if (t) {
        setField('amount', t.amount.toString());
        setField('type', t.type);
        setField('description', t.description);
        setField('categoryId', t.categoryId);
      }
    }
  }, [transactions]);

  const onSubmit = () => {
    handleSubmit(async (data) => {
      if (isNew) await createTransaction(data);
      else await updateTransaction(id, data);
      router.back();
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>
            {isNew ? 'Nueva transacción' : 'Editar transacción'}
          </Text>

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={styles.input}
            value={values.description}
            onChangeText={v => setField('description', v)}
            placeholder="Ej: Supermercado"
          />
          {errors.description && <Text style={styles.error}>{errors.description}</Text>}

          <Text style={styles.label}>Monto</Text>
          <TextInput
            style={styles.input}
            value={values.amount}
            onChangeText={v => setField('amount', v)}
            keyboardType="numeric"
            placeholder="0"
          />
          {errors.amount && <Text style={styles.error}>{errors.amount}</Text>}

          <Text style={styles.label}>Tipo</Text>
          <View style={styles.typeRow}>
            {(['income', 'expense'] as const).map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.typeBtn, values.type === t && styles.typeBtnActive]}
                onPress={() => setField('type', t)}
              >
                <Text style={[styles.typeBtnText, values.type === t && styles.typeBtnTextActive]}>
                  {t === 'income' ? 'Ingreso' : 'Egreso'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Categoría</Text>
          {categories.length === 0 && (
            <Text style={styles.error}>No hay categorías. Crea una primero.</Text>
          )}
          <View style={styles.catGrid}>
            {categories.map(c => (
              <TouchableOpacity
                key={c.id}
                style={[styles.catBtn, values.categoryId === c.id && styles.catBtnActive]}
                onPress={() => setField('categoryId', c.id)}
              >
                <Text style={[styles.catBtnText, values.categoryId === c.id && styles.catBtnTextActive]}>
                  {c.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.categoryId && <Text style={styles.error}>{errors.categoryId}</Text>}

          <TouchableOpacity style={styles.btn} onPress={onSubmit} disabled={submitting}>
            {submitting
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>{isNew ? 'Crear' : 'Guardar'}</Text>
            }
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24 },
  label: { fontSize: 14, color: '#444', marginBottom: 6, marginTop: 16 },
  input: {
    borderWidth: 1, borderColor: '#ccc',
    borderRadius: 8, padding: 12, fontSize: 16,
  },
  error: { color: 'red', fontSize: 12, marginTop: 4 },
  typeRow: { flexDirection: 'row', gap: 12 },
  typeBtn: {
    flex: 1, padding: 12, borderRadius: 8,
    borderWidth: 1, borderColor: '#ccc', alignItems: 'center',
  },
  typeBtnActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  typeBtnText: { color: '#444', fontWeight: '600' },
  typeBtnTextActive: { color: '#fff' },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catBtn: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: '#ccc',
  },
  catBtnActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  catBtnText: { color: '#444' },
  catBtnTextActive: { color: '#fff' },
  btn: {
    marginTop: 32, backgroundColor: '#007AFF',
    padding: 14, borderRadius: 8, alignItems: 'center',
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});