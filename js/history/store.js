// 月影决策屋 - 历史记录存储层

const STORAGE_KEY = 'moon_oracle_history';
const MAX_RECORDS = 50;

export const MoonHistory = {
    _records: null,

    _load() {
        if (this._records !== null) return this._records;
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            this._records = saved ? JSON.parse(saved) : [];
        } catch (e) {
            this._records = [];
        }
        return this._records;
    },

    _save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this._records));
        } catch (e) {
            console.warn('历史记录保存失败:', e.message);
        }
    },

    _trim() {
        if (this._records.length > MAX_RECORDS) {
            this._records = this._records.slice(-MAX_RECORDS);
        }
    },

    addRecord(type, data, summary) {
        const record = {
            id: Date.now(),
            type: type,
            timestamp: Date.now(),
            data: data,
            summary: summary || ''
        };
        this._load();
        this._records.push(record);
        this._trim();
        this._save();
        return record;
    },

    getRecords(type = null) {
        this._load();
        let records = [...this._records].reverse();
        if (type) {
            records = records.filter(r => r.type === type);
        }
        return records;
    },

    getRecord(id) {
        this._load();
        return this._records.find(r => r.id === id) || null;
    },

    deleteRecord(id) {
        this._load();
        const index = this._records.findIndex(r => r.id === id);
        if (index !== -1) {
            this._records.splice(index, 1);
            this._save();
            return true;
        }
        return false;
    },

    clearRecords() {
        this._records = [];
        this._save();
    },

    getRecordCount(type = null) {
        this._load();
        if (type) {
            return this._records.filter(r => r.type === type).length;
        }
        return this._records.length;
    }
};
