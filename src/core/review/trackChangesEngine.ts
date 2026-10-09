import { TrackChangeItem } from '../../types/document';

export class TrackChangesEngine {
  public static createChange(
    type: 'insert' | 'delete' | 'format',
    text: string,
    author: string = 'Current User',
    avatarColor: string = '#2B579A'
  ): TrackChangeItem {
    return {
      id: 'tc_' + Math.random().toString(36).substring(2, 9),
      type,
      author,
      avatarColor,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
      status: 'pending',
    };
  }

  public static acceptChange(changes: TrackChangeItem[], changeId: string): TrackChangeItem[] {
    return changes.map((c) => (c.id === changeId ? { ...c, status: 'accepted' as const } : c));
  }

  public static rejectChange(changes: TrackChangeItem[], changeId: string): TrackChangeItem[] {
    return changes.map((c) => (c.id === changeId ? { ...c, status: 'rejected' as const } : c));
  }

  public static acceptAllChanges(changes: TrackChangeItem[]): TrackChangeItem[] {
    return changes.map((c) => ({ ...c, status: 'accepted' as const }));
  }

  public static rejectAllChanges(changes: TrackChangeItem[]): TrackChangeItem[] {
    return changes.map((c) => ({ ...c, status: 'rejected' as const }));
  }

  public static getPendingChanges(changes: TrackChangeItem[]): TrackChangeItem[] {
    return changes.filter((c) => c.status === 'pending');
  }
}
