import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp } from '../AppContext';
import { Btn, s } from '../ui';
import type { RootStackParamList } from '../types';
import {confirmAction} from '../confirm';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export default function DishDetail({ route, navigation }: Props) {
  const { t, dishes, cats, deleteDish } = useApp();
  const d = dishes.find((x) => x.Id === route.params?.id);
  if (!d) return (
    <View style={[s.screen, { alignItems: 'center', justifyContent: 'center' }]}>
      <Text style={s.title}>{t('notFound')}</Text>
      <Btn title={t('back')} onPress={() => navigation.goBack()} style={{ marginTop: 12 }} />
    </View>
  );
  const imgs = d.DishImage || [];
  const quick = d.PreparationTime <= 15;
  const confirmDelete = () =>
  confirmAction(t('confirmTitle'), t('confirmDish'), t('delete'), t('cancel'), async () => {
    await deleteDish(d.Id);
    navigation.goBack();
  });
  return (
    <ScrollView style={s.screen}>
      {imgs.length === 0 ? <Text style={{ marginBottom: 10 }}>{t('noImages')}</Text> : (
        <ScrollView horizontal style={{ marginBottom: 10 }}>
          {imgs.map((im, i) => (
            <View key={i} style={{ marginRight: 8 }}>
              <Image source={{ uri: im.ImageUrl }} style={{ width: 260, height: 180, borderRadius: 10, backgroundColor: '#ddd' }} />
              {im.IsThumbnail && <Text style={[s.tag, { backgroundColor: '#f59e0b', position: 'absolute', top: 6, left: 6 }]}>{t('thumbnail')}</Text>}
            </View>
          ))}
        </ScrollView>
      )}
      <Text style={s.title}>{d.Name}</Text>
      <Text>{t('category')}: {cats.find((c) => c.Id === d.DishCategoryId)?.Name || '-'}</Text>
      <Text>{t('price')}: {Number(d.Price).toLocaleString()} đ</Text>
      <Text>{t('prepTime')}: {d.PreparationTime} · {quick ? t('quick') : t('regular')}</Text>
      <Text>{d.IsAvailable ? t('available') : t('unavailable')}</Text>
      <Text style={{ marginVertical: 8 }}>{d.Description}</Text>
      <View style={s.row}>
        <Btn title={t('edit')} onPress={() => navigation.navigate('Form', { id: d.Id })} />
        <Btn title={t('delete')} color="#dc2626" onPress={confirmDelete} />
      </View>
    </ScrollView>
  );
}
