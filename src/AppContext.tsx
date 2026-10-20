import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { T } from './config';
import { readAll, mutate, seedIfEmpty } from './store';
import { runSync } from './sync';
import { DICT, TKey } from './i18n';
import type { CategoryInput, Dish, DishCategory, DishInput, Entity, Filters, Lang, SyncMeta } from './types';

interface AppCtx {
  dishes: Dish[]; cats: DishCategory[]; pending: number; online: boolean; lang: Lang;
  filters: Filters; setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  t: (k: TKey) => string; setLang: (l: Lang) => void;
  saveDish: (d: DishInput) => Promise<void>; deleteDish: (id: string) => Promise<void>;
  saveCat: (c: CategoryInput) => Promise<void>; deleteCat: (id: string) => Promise<{ error?: TKey }>;
}
const Ctx = createContext<AppCtx>(null as unknown as AppCtx);
export const useApp = (): AppCtx => useContext(Ctx);
export const newId = (p: string): string => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const upsert = <E extends Entity>(table: string, item: Omit<E, keyof SyncMeta>) =>
  mutate<E>(table, (l) => {
    const o = l.find((x) => x.Id === item.Id);
    const rec = { ...(o || {}), ...item, UpdatedAt: Date.now(),
      RemoteId: o ? o.RemoteId : null, SyncStatus: o && o.RemoteId ? 'pending_update' : 'pending_create' } as E;
    return o ? l.map((x) => (x.Id === item.Id ? rec : x)) : [...l, rec];
  });
const remove = (table: string, id: string) =>
  mutate<Entity>(table, (l) => l.flatMap((x): Entity[] =>
    x.Id !== id ? [x] : x.RemoteId ? [{ ...x, SyncStatus: 'pending_delete', UpdatedAt: Date.now() }] : []));

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [cats, setCats] = useState<DishCategory[]>([]);
  const [pending, setPending] = useState(0);
  const [online, setOnline] = useState(true);
  const [lang, setLangState] = useState<Lang>('en');          // mặc định English
  // Bộ lọc nằm ở context => giữ nguyên khi chuyển màn hình
  const [filters, setFilters] = useState<Filters>({ search: '', categoryId: '', onlyAvailable: false, min: '', max: '', sort: '' });

  const reload = useCallback(async () => {
    const [d, c] = await Promise.all([readAll<Dish>(T.dish), readAll<DishCategory>(T.cat)]);
    const alive = <E extends Entity>(l: E[]) => l.filter((x) => x.SyncStatus !== 'pending_delete');
    setDishes(alive(d)); setCats(alive(c));
    setPending([...d, ...c].filter((x) => x.SyncStatus !== 'synced').length);
  }, []);
  const sync = useCallback(() => runSync(reload), [reload]);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    (async () => {
      const l = await AsyncStorage.getItem(T.lang);
      if (l === 'en' || l === 'vi') setLangState(l);
      await reload();
      const net = await NetInfo.fetch();
      if (net.isConnected) await sync();               // lấy dữ liệu từ MockAPI trước
      await seedIfEmpty();                              // rồi mới seed nếu vẫn trống
      await reload(); sync();
      // Tự động đồng bộ khi có mạng trở lại (không cần nút)
      unsub = NetInfo.addEventListener((s) => {
        const on = !!s.isConnected && s.isInternetReachable !== false;
        setOnline(on);
        if (on) sync();
      });
    })();
    return () => unsub?.();
  }, []);

  const act = async (fn: () => Promise<unknown>) => { await fn(); await reload(); sync(); };
  const value: AppCtx = {
    dishes, cats, pending, online, lang, filters, setFilters,
    t: (k) => DICT[lang][k],
    setLang: (l) => { setLangState(l); AsyncStorage.setItem(T.lang, l); },
    saveDish: (d) => act(() => upsert<Dish>(T.dish, d)),
    deleteDish: (id) => act(() => remove(T.dish, id)),
    saveCat: (c) => act(() => upsert<DishCategory>(T.cat, c)),
    deleteCat: async (id) => {
      if (dishes.some((d) => d.DishCategoryId === id)) return { error: 'errCategoryInUse' };
      await act(() => remove(T.cat, id));
      return {};
    },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
