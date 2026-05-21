import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, StatusBar, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api.native';
import { COLORS, SHADOWS, SIZES } from '../config/theme';

export default function AddEditProductScreen({ route, navigation }) {
  const existing = route.params?.product;
  const isEdit = !!existing;

  const [brand, setBrand] = useState(existing?.brand || '');
  const [model, setModel] = useState(existing?.model || '');
  const [price, setPrice] = useState(existing?.price?.toString() || '');
  const [stock, setStock] = useState(existing?.stock?.toString() || '');
  const [ram, setRam] = useState(existing?.specs?.ram || '');
  const [storage, setStorage] = useState(existing?.specs?.storage || '');
  const [imageUrl, setImageUrl] = useState(existing?.imageUrl || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!brand || !model || !price || !stock || !ram || !storage) {
      Alert.alert('Uyarı', 'Tüm zorunlu alanları doldurun.');
      return;
    }
    setSaving(true);
    try {
      const payload = { brand, model, price: Number(price), stock: Number(stock), specs: { ram, storage }, imageUrl };
      if (isEdit) {
        await api.put(`/seller/products/${existing._id}`, payload);
        Alert.alert('✅ Başarılı', 'Ürün güncellendi.');
      } else {
        await api.post('/seller/products', payload);
        Alert.alert('✅ Başarılı', 'Yeni ürün eklendi.');
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Hata', e.response?.data?.message || e.response?.data?.detay || 'İşlem başarısız.');
    } finally { setSaving(false); }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={isEdit ? COLORS.gradient : COLORS.gradientSecondary} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#FFF" /></TouchableOpacity>
        <Text style={styles.headerTitle}>{isEdit ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={[styles.card, SHADOWS.small]}>
            
            {/* Marka */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Marka</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="pricetag-outline" size={18} color={COLORS.textMuted} style={{ marginLeft: 12 }} />
                <TextInput style={styles.input} value={brand} onChangeText={setBrand} placeholderTextColor={COLORS.textMuted} placeholder="Marka" />
              </View>
            </View>

            {/* Model */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Model</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="phone-portrait-outline" size={18} color={COLORS.textMuted} style={{ marginLeft: 12 }} />
                <TextInput style={styles.input} value={model} onChangeText={setModel} placeholderTextColor={COLORS.textMuted} placeholder="Model" />
              </View>
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Fiyat (₺)</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="cash-outline" size={18} color={COLORS.textMuted} style={{ marginLeft: 12 }} />
                    <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" placeholderTextColor={COLORS.textMuted} placeholder="Fiyat (₺)" />
                  </View>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Stok</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="layers-outline" size={18} color={COLORS.textMuted} style={{ marginLeft: 12 }} />
                    <TextInput style={styles.input} value={stock} onChangeText={setStock} keyboardType="numeric" placeholderTextColor={COLORS.textMuted} placeholder="Stok" />
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>RAM</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="hardware-chip-outline" size={18} color={COLORS.textMuted} style={{ marginLeft: 12 }} />
                    <TextInput style={styles.input} value={ram} onChangeText={setRam} placeholderTextColor={COLORS.textMuted} placeholder="RAM" />
                  </View>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Depolama</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="server-outline" size={18} color={COLORS.textMuted} style={{ marginLeft: 12 }} />
                    <TextInput style={styles.input} value={storage} onChangeText={setStorage} placeholderTextColor={COLORS.textMuted} placeholder="Depolama" />
                  </View>
                </View>
              </View>
            </View>

            {/* Görsel URL */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Görsel URL</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="image-outline" size={18} color={COLORS.textMuted} style={{ marginLeft: 12 }} />
                <TextInput style={styles.input} value={imageUrl} onChangeText={setImageUrl} placeholderTextColor={COLORS.textMuted} placeholder="Görsel URL" />
              </View>
            </View>

          </View>

          <TouchableOpacity onPress={handleSave} disabled={saving} activeOpacity={0.8}>
            <LinearGradient colors={isEdit ? COLORS.gradient : COLORS.gradientSecondary} style={styles.saveBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              {saving ? <ActivityIndicator color="#FFF" /> : (
                <><Ionicons name={isEdit ? 'checkmark-circle' : 'add-circle'} size={20} color="#FFF" />
                <Text style={styles.saveTxt}>{isEdit ? 'Güncelle' : 'Ürünü Ekle'}</Text></>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 50, paddingBottom: 18, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  scroll: { padding: 16, paddingBottom: 40 },
  card: { backgroundColor: '#FFF', borderRadius: SIZES.radius, padding: 18, marginBottom: 16 },
  row: { flexDirection: 'row' },
  fieldGroup: { marginBottom: 14 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.inputBg, borderRadius: SIZES.radiusSm, borderWidth: 1, borderColor: COLORS.border },
  input: { flex: 1, fontSize: 14, color: COLORS.text, paddingVertical: 12, paddingHorizontal: 10 },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: SIZES.radiusSm, paddingVertical: 16, gap: 8 },
  saveTxt: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
