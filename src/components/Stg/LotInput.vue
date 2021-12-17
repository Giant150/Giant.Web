<template>
  <div>
    <a-input-number v-model="curVal" v-if="lotStg[`${name}Type`]==='Number'" style="width:100%" v-bind="$attrs" />
    <a-date-picker v-model="curVal" v-else-if="lotStg[`${name}Type`]==='Date'" valueFormat="YYYY-MM-DD" v-bind="$attrs" />
    <EnumSelect :code="lotStg[`${name}Enum`]" v-model="curVal" v-else-if="lotStg[`${name}Type`]==='Enum'" style="width:100%" v-bind="$attrs" @select="(val,item)=>{$emit('select', val, item)}"></EnumSelect>
    <CommonSelect :table="lotStg[`${name}Enum`]" v-model="curVal" v-else-if="lotStg[`${name}Type`]==='Select'" style="width:100%" v-bind="$attrs" @select="(val,item)=>{$emit('select', val, item)}"></CommonSelect>
    <a-input v-else v-model="curVal" v-bind="$attrs" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import EnumSelect from '@/components/CF/EnumSelect'
import CommonSelect from '@/components/CF/CommonSelect'
export default {
  components: {
    EnumSelect,
    CommonSelect
  },
  props: {
    name: String,
    sku: Object,
    value: String
  },
  data() {
    return {
      curVal: '',
      lotStg: {
        Id: '', WhseId: '', Code: 'Default', Name: 'Default',
        Lot01Required: false, Lot02Required: false, Lot03Required: false, Lot04Required: false, Lot05Required: false, Lot06Required: false, Lot07Required: false, Lot08Required: false, Lot09Required: false, Lot10Required: false,
        Lot01RequiredRF: false, Lot02RequiredRF: false, Lot03RequiredRF: false, Lot04RequiredRF: false, Lot05RequiredRF: false, Lot06RequiredRF: false, Lot07RequiredRF: false, Lot08RequiredRF: false, Lot09RequiredRF: false, Lot10RequiredRF: false,
        Lot01Enum: null, Lot02Enum: null, Lot03Enum: null, Lot04Enum: null, Lot05Enum: null, Lot06Enum: null, Lot07Enum: null, Lot08Enum: null, Lot09Enum: null, Lot10Enum: null,
        Lot01Type: null, Lot02Type: null, Lot03Type: null, Lot04Type: null, Lot05Type: null, Lot06Type: null, Lot07Type: null, Lot08Type: null, Lot09Type: null, Lot10Type: null,
        Lot01Default: null, Lot02Default: null, Lot03Default: null, Lot04Default: null, Lot05Default: null, Lot06Default: null, Lot07Default: null, Lot08Default: null, Lot09Default: null, Lot10Default: null
      }
    }
  },
  computed: {
    ...mapGetters({
      defaultWhseId: 'whseId',
      defaultStorerId: 'storerId'
    })
  },
  watch: {
    value(newVal) {
      if (this.curVal !== newVal) {
        this.curVal = this.value
      }
    },
    curVal(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit('input', newVal)
      }
    },
    sku(newVal) {
      if (newVal && newVal.LotStgId) {
        this.getLotStg(newVal.LotStgId).then(stg => {
          this.lotStg = stg
        })
      } else {
        this.lotStg = {
          Id: '', WhseId: '', Code: 'Default', Name: 'Default',
          Lot01Required: false, Lot02Required: false, Lot03Required: false, Lot04Required: false, Lot05Required: false, Lot06Required: false, Lot07Required: false, Lot08Required: false, Lot09Required: false, Lot10Required: false,
          Lot01RequiredRF: false, Lot02RequiredRF: false, Lot03RequiredRF: false, Lot04RequiredRF: false, Lot05RequiredRF: false, Lot06RequiredRF: false, Lot07RequiredRF: false, Lot08RequiredRF: false, Lot09RequiredRF: false, Lot10RequiredRF: false,
          Lot01Enum: null, Lot02Enum: null, Lot03Enum: null, Lot04Enum: null, Lot05Enum: null, Lot06Enum: null, Lot07Enum: null, Lot08Enum: null, Lot09Enum: null, Lot10Enum: null,
          Lot01Type: null, Lot02Type: null, Lot03Type: null, Lot04Type: null, Lot05Type: null, Lot06Type: null, Lot07Type: null, Lot08Type: null, Lot09Type: null, Lot10Type: null,
          Lot01Default: null, Lot02Default: null, Lot03Default: null, Lot04Default: null, Lot05Default: null, Lot06Default: null, Lot07Default: null, Lot08Default: null, Lot09Default: null, Lot10Default: null
        }
      }
    }
  },
  mounted() {
    this.curVal = this.value
    if (this.sku && this.sku.LotStgId) {
      this.getLotStg(this.sku.LotStgId).then(stg => {
        this.lotStg = stg
      })
    }
  },
  methods: {
    ...mapActions({ getLotStg: 'getLotStg' })
  }
}
</script>

<style>
</style>
