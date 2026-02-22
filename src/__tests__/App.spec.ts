import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('mounts and renders the ASCII banner', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('FORRIA')
  })
})
