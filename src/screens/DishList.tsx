import React, { useMemo } from 'react';
import { View, Text, TextInput, FlatList, Image, Switch, TouchableOpacity, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp } from '../AppContext';
import { Btn, Chip, s } from '../ui';
import { MSSV } from '../config';
import type { Dish, Filters, RootStackParamList, SortKey } from '../types';
import type { TKey } from '../i18n';

type Props = NativeStackScreenProps<RootStackParamList, 'List'>;
const SORTS: [SortKey, TKey][] = [['', 'sortNone'], ['priceAsc', 'sortPriceAsc'], ['priceDesc', 'sortPriceDesc'], ['timeAsc', 'sortTimeAsc']];

export default function DishList({ navigation }: Props) {
  const { t, dishes, cats, filters: f, setFilters, lang, setLang, online, pending } = useApp();
  const set = (p: Partial<Filters>) => setFilters({ ...f, ...p });
  const min = f.min === '' ? null : Number(f.min);
  const max = f.max === '' ? null : Number(f.max);
  const badRange = (min !== null && (isNaN(min) || min < 0)) || (max !== null && (isNaN(max) || max < 0))
    || (min !== null && max !== null && min > max);

  const list = useMemo(() => {
    const q = f.search.trim().toLowerCase();
    const r = dishes.filter((d) =>
      d.Name.toLowerCase().includes(q) &&
      (!f.categoryId || d.DishCategoryId === f.categoryId) &&
      (!f.onlyAvailable || d.IsAvailable) &&
      (badRange || min === null || d.Price >= min) &&
      (badRange || max === null || d.Price <= max));
    if (f.sort === 'priceAsc') r.sort((a, b) => a.Price - b.Price);
    if (f.sort === 'priceDesc') r.sort((a, b) => b.Price - a.Price);
    if (f.sort === 'timeAsc') r.sort((a, b) => a.PreparationTime - b.PreparationTime);
    return r;
  }, [dishes, f]);

  const catName = (id: string) => cats.find((c) => c.Id === id)?.Name || '-';
  const renderItem = ({ item: d }: { item: Dish }) => {
    const imgs = d.DishImage || [];
    const img = imgs.find((i) => i.IsThumbnail) || imgs[0];
    const quick = d.PreparationTime <= 15;
    return (
      <TouchableOpacity style={s.card} onPress={() => navigation.navigate('Detail', { id: d.Id })}>
        <Image style={s.thumb} source={img ? { uri: img.ImageUrl } : undefined} />
        <View style={{ flex: 1 }}>
          <Text style={s.title}>{d.Name}</Text>
          <Text>{Number(d.Price).toLocaleString()} đ · {d.PreparationTime} {t('min')} · {catName(d.DishCategoryId)}</Text>
          <View style={s.row}>
            <Text style={[s.tag, { backgroundColor: quick ? '#16a34a' : '#6b7280', marginRight: 6 }]}>{quick ? t('quick') : t('regular')}</Text>
            <Text style={[s.tag, { backgroundColor: d.IsAvailable ? '#2563eb' : '#dc2626' }]}>{d.IsAvailable ? t('available') : t('unavailable')}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={s.screen}>
      <View style={[s.row, { justifyContent: 'space-between', marginBottom: 6 }]}>
        <View>
          <Text style={s.title}>{t('dishes')} · {MSSV}</Text>
          <Text style={{ fontSize: 12, color: online ? '#16a34a' : '#dc2626' }}>
            {online ? t('online') : t('offline')}{pending > 0 ? ` · ${pending} ${t('pending')}` : ''}
          </Text>
        </View>
        <View style={s.row}>
          <Btn title={lang === 'en' ? 'VI' : 'EN'} color="#6b7280" onPress={() => setLang(lang === 'en' ? 'vi' : 'en')} />
          <Btn title={t('categories')} color="#7c3aed" onPress={() => navigation.navigate('Categories')} />
          <Btn title={'+ ' + t('add')} onPress={() => navigation.navigate('Form')} />
        </View>
      </View>

      <TextInput style={s.input} placeholder={t('search')} value={f.search} onChangeText={(v) => set({ search: v })} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
        <Chip title={t('all')} active={!f.categoryId} onPress={() => set({ categoryId: '' })} />
        {cats.map((c) => <Chip key={c.Id} title={c.Name} active={f.categoryId === c.Id} onPress={() => set({ categoryId: c.Id })} />)}
      </ScrollView>
      <View style={[s.row, { marginBottom: 6 }]}>
        <Switch value={f.onlyAvailable} onValueChange={(v) => set({ onlyAvailable: v })} />
        <Text style={{ marginHorizontal: 6 }}>{t('onlyAvailable')}</Text>
        <TextInput style={[s.input, { width: 80, marginBottom: 0, marginRight: 6 }]} keyboardType="numeric"
          placeholder={t('minPrice')} value={f.min} onChangeText={(v) => set({ min: v })} />
        <TextInput style={[s.input, { width: 80, marginBottom: 0 }]} keyboardType="numeric"
          placeholder={t('maxPrice')} value={f.max} onChangeText={(v) => set({ max: v })} />
      </View>
      {badRange && <Text style={s.err}>{t('errPriceRange')}</Text>}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
        {SORTS.map(([k, l]) => <Chip key={k} title={t(l)} active={f.sort === k} onPress={() => set({ sort: k })} />)}
      </ScrollView>

      <FlatList data={list} keyExtractor={(d) => d.Id} renderItem={renderItem}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 30 }}>{t('noDishes')}</Text>} />
    </View>
  );
}
