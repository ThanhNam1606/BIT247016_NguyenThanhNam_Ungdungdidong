import React, { useState } from 'react';
import { View, Text, TextInput, FlatList } from 'react-native';
import { useApp, newId } from '../AppContext';
import { Btn, s } from '../ui';
import type { CategoryInput, DishCategory } from '../types';
import type { TKey } from '../i18n';
import {confirmAction, notify} from '../confirm';

export default function Categories() {
  const { t, cats, saveCat, deleteCat } = useApp();
  const empty = (): CategoryInput => ({ Id: newId('cat'), Name: '', Description: '' });
  const [f, setF] = useState<CategoryInput>(empty());
  const [editing, setEditing] = useState(false);
  const [err, setErr] = useState<TKey | ''>('');

  const save = async () => {
    const name = f.Name.trim();
    if (!name) return setErr('errNameRequired');
    if (cats.some((c) => c.Id !== f.Id && c.Name.trim().toLowerCase() === name.toLowerCase())) return setErr('errNameDuplicate');
    setErr('');
    await saveCat({ ...f, Name: name });
    setF(empty()); setEditing(false);
  };
 const del = (c: DishCategory) =>
  confirmAction(t('confirmTitle'), t('confirmCat'), t('delete'), t('cancel'), async () => {
    const r = await deleteCat(c.Id);
    if (r.error) notify(t(r.error));
  });

  return (
    <View style={s.screen}>
      <Text style={s.label}>{editing ? t('editCategory') : t('addCategory')}</Text>
      <TextInput style={s.input} placeholder={t('name')} value={f.Name} onChangeText={(v) => setF({ ...f, Name: v })} />
      {!!err && <Text style={s.err}>{t(err)}</Text>}
      <TextInput style={s.input} placeholder={t('description')} value={f.Description} onChangeText={(v) => setF({ ...f, Description: v })} />
      <View style={s.row}>
        <Btn title={t('save')} onPress={save} />
        {editing && <Btn title={t('cancel')} color="#6b7280" onPress={() => { setF(empty()); setEditing(false); setErr(''); }} />}
      </View>
      <FlatList style={{ marginTop: 12 }} data={cats} keyExtractor={(c) => c.Id}
        ListEmptyComponent={<Text>{t('noCategories')}</Text>}
        renderItem={({ item: c }) => (
          <View style={[s.card, { justifyContent: 'space-between', alignItems: 'center' }]}>
            <View style={{ flex: 1 }}><Text style={s.title}>{c.Name}</Text><Text>{c.Description}</Text></View>
            <Btn title={t('edit')} onPress={() => { setF({ Id: c.Id, Name: c.Name, Description: c.Description }); setEditing(true); }} />
            <Btn title={t('delete')} color="#dc2626" onPress={() => del(c)} />
          </View>
        )} />
    </View>
  );
}
