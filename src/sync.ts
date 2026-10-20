import { T } from './config';
import { api } from './api';
import { readAll, mutate } from './store';
import type { Entity, SyncMeta } from './types';

let current: Promise<void> | null = null;   // đang sync -> không chạy song song (tránh trùng bản ghi)
let again = false;

const mark = (table: string, it: Entity, patch: Partial<SyncMeta>) =>
  mutate<Entity>(table, (l) => l.map((x): Entity => x.Id !== it.Id ? x : {
    ...x, ...patch,
    // nếu người dùng sửa tiếp trong lúc sync thì giữ trạng thái chờ
    SyncStatus: x.UpdatedAt === it.UpdatedAt ? 'synced' : 'pending_update',
  }));

async function push(table: string): Promise<void> {
  const items = (await readAll<Entity>(table)).filter((i) => i.SyncStatus !== 'synced');
  for (const it of items) {
    const { SyncStatus, RemoteId, ...body } = it;
    if (SyncStatus === 'pending_delete') {
      if (RemoteId) await api('DELETE', `${table}/${RemoteId}`);
      await mutate<Entity>(table, (l) => l.filter((x) => x.Id !== it.Id));
    } else if (!RemoteId) {
      const r = await api('POST', table, body);
      await mark(table, it, { RemoteId: r.id });
    } else {
      await api('PUT', `${table}/${RemoteId}`, body);
      await mark(table, it, {});
    }
  }
}

async function pull(table: string): Promise<void> {
  const remote: Record<string, any>[] = await api('GET', table);
  const remoteIds = new Set(remote.map((r) => r.id));
  const seen = new Set<string>();
  await mutate<Entity>(table, (local) => {
    // bản ghi đã sync nhưng bị xóa trên MockAPI -> xóa local
    const out = local.filter((l) => !(l.SyncStatus === 'synced' && l.RemoteId && !remoteIds.has(l.RemoteId)));
    for (const r of remote) {
      const Id: string = r.Id || 'remote-' + r.id;
      if (seen.has(Id)) continue;           // bỏ bản trùng
      seen.add(Id);
      const { id, ...rest } = r;
      const rec: Record<string, any> = { ...rest, Id, RemoteId: id, SyncStatus: 'synced' };
      if ('Price' in rec) {
        rec.Price = Number(rec.Price);
        rec.PreparationTime = Number(rec.PreparationTime);
        rec.IsAvailable = rec.IsAvailable === true || rec.IsAvailable === 'true';
        rec.DishImage = rec.DishImage || [];
      }
      const i = out.findIndex((x) => x.Id === Id);       // gộp theo Id, không append mù quáng
      if (i < 0) out.push(rec as Entity);
      else if (out[i].SyncStatus === 'synced') out[i] = rec as Entity;   // đang chờ đẩy thì giữ bản local
    }
    return out;
  });
}

export function runSync(onDone?: () => void): Promise<void> {
  if (current) { again = true; return current; }
  current = (async () => {
    try {
      do {
        again = false;
        await push(T.cat); await push(T.dish);     // loại trước, món sau
        await pull(T.cat); await pull(T.dish);
      } while (again);
    } catch (e) { console.log('sync error:', (e as Error).message); }   // offline/lỗi API: giữ nguyên local
    finally { current = null; onDone?.(); }
  })();
  return current;
}
