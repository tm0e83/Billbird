import { describe, it, expect } from 'vitest';
import { createPinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { useStore } from '@/stores/store.js';
import DatagroupItem from '../DatagroupItem.vue';
import datagroupJson from './helper/datagroup.json';
import datasetJson from './helper/dataset.json';

const wrapper = mount(DatagroupItem, {
  global: {
    plugins: [createPinia()],
  },
  propsData: {
    datagroup: Object.assign({}, datagroupJson, { datasets: [datasetJson] }),
  },
});

const store = useStore();

store.datagroups = [Object.assign({}, datagroupJson, { datasets: [datasetJson] })];

describe('DatagroupList', () => {
  it('shows 1 dataset', () => {
    expect(wrapper.findAll('.dataset').length).toBe(1);
  });
});
