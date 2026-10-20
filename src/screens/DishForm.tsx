import React, { useState } from 'react';
import { View, Text, TextInput, Switch, Image, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp, newId } from '../AppContext';
import { validateDish, isUrl, FormErrors } from '../validation';
import { Btn, Chip, s } from '../ui';
import type { DishFormState, RootStackParamList } from '../types';
import type { TKey } from '../i18n';
import{ notify } from '../confirm';

type Props = NativeStackScreenProps<RootStackParamList, 'Form'>;
type Errs = FormErrors & { url?: TKey };

export default function DishForm({ route, navigation }: Props) {
  const { t, dishes, cats, saveDish } = useApp();
  const id = route.params?.id;
  const editing = dishes.find((d) => d.Id === id);
  const [f, setF] = useState<DishFormState>(() => editing
    ? { ...editing, Price: String(editing.Price), PreparationTime: String(editing.PreparationTime), DishImage: editing.DishImage || [] }
    : { Id: newId('dish'), Name: '', Price: '', PreparationTime: '', IsAvailable: true, Description: '', DishCategoryId: cats[0]?.Id || '', DishImage: [] });
  const [url, setUrl] = useState('');
  const [err, setErr] = useState<Errs>({});
  const set = (p: Partial<DishFormState>) => setF({ ...f, ...p });

  if (id && !editing) return <View style={s.screen}><Text style={s.title}>{t('notFound')}</Text></View>;

  const addImage = () => {
    if (!isUrl(url)) return setErr({ ...err, url: 'errImageUrl' });
    setErr({ ...err, url: undefined });
    set({ DishImage: [...f.DishImage, { ImageUrl: url.trim(), IsThumbnail: f.DishImage.length === 0 }] });
    setUrl('');
  };
  // Luôn đảm bảo tối đa 1 ảnh IsThumbnail = true
  const setThumb = (i: number) => set({ DishImage: f.DishImage.map((im, j) => ({ ...im, IsThumbnail: j === i })) });
  const removeImg = (i: number) => {
    const rest = f.DishImage.filter((_, j) => j !== i);
    if (rest.length && !rest.some((x) => x.IsThumbnail)) rest[0] = { ...rest[0], IsThumbnail: true };
    set({ DishImage: rest });
  };
  const save = async () => {
    const e = validateDish(f, dishes, cats);
    setErr(e);
    if (Object.keys(e).length) return;
    try {
      await saveDish({ ...f, Name: f.Name.trim(), Price: Number(f.Price), PreparationTime: Number(f.PreparationTime) });
      navigation.goBack();
    } catch { notify(t('errSave')); }
  };
  const E = ({ k }: { k: keyof Errs }) => {
    const m = err[k];
    return m ? <Text style={s.err}>{t(m)}</Text> : null;
  };

  return (
    <ScrollView style={s.screen}>
      <Text style={s.label}>{t('name')}</Text>
      <TextInput style={s.input} value={f.Name} onChangeText={(v) => set({ Name: v })} /><E k="Name" />
      <Text style={s.label}>{t('price')}</Text>
      <TextInput style={s.input} keyboardType="numeric" value={f.Price} onChangeText={(v) => set({ Price: v })} /><E k="Price" />
      <Text style={s.label}>{t('prepTime')}</Text>
      <TextInput style={s.input} keyboardType="numeric" value={f.PreparationTime} onChangeText={(v) => set({ PreparationTime: v })} /><E k="PreparationTime" />
      <Text style={s.label}>{t('description')}</Text>
      <TextInput style={s.input} multiline value={f.Description} onChangeText={(v) => set({ Description: v })} />
      <Text style={s.label}>{t('category')}</Text>
      <View style={s.row}>
        {cats.map((c) => <Chip key={c.Id} title={c.Name} active={f.DishCategoryId === c.Id} onPress={() => set({ DishCategoryId: c.Id })} />)}
      </View>
      <E k="DishCategoryId" />
      <View style={s.row}><Switch value={f.IsAvailable} onValueChange={(v) => set({ IsAvailable: v })} />
        <Text style={{ marginLeft: 8 }}>{f.IsAvailable ? t('available') : t('unavailable')}</Text></View>

      <Text style={s.label}>{t('images')}</Text>
      {f.DishImage.length === 0 && <Text>{t('noImages')}</Text>}
      {f.DishImage.map((im, i) => (
        <View key={i} style={[s.row, { marginBottom: 6 }]}>
          <Image source={{ uri: im.ImageUrl }} style={{ width: 50, height: 50, borderRadius: 6, marginRight: 8, backgroundColor: '#ddd' }} />
          <Btn title={im.IsThumbnail ? '★ ' + t('thumbnail') : t('setThumbnail')} color={im.IsThumbnail ? '#f59e0b' : '#6b7280'} onPress={() => setThumb(i)} />
          <Btn title={t('remove')} color="#dc2626" onPress={() => removeImg(i)} />
        </View>
      ))}
      <TextInput style={s.input} placeholder={t('imageUrl')} autoCapitalize="none" value={url} onChangeText={setUrl} /><E k="url" />
      <Btn title={t('addImage')} color="#7c3aed" onPress={addImage} style={{ alignSelf: 'flex-start' }} />

      <View style={[s.row, { marginVertical: 16 }]}>
        <Btn title={t('save')} onPress={save} />
        <Btn title={t('cancel')} color="#6b7280" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
}
