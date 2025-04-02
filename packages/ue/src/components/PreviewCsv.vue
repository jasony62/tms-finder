<template>
  <div id="preview">
    <el-dialog
      title="文件预览"
      :closeOnClickModal="false"
      v-model="dialogVisible"
      :fullscreen="true"
    >
      <div class="flex flex-row gap-2 h-full" style="background-color: #efefef">
        <div class="h-full flex-grow">
          <el-auto-resizer class="flex-grow overflow-x-auto">
            <template #default="{ height, width }">
              <el-table-v2
                id="table"
                :data="tableRows"
                :columns="tableColumns"
                :row-height="rowHeight"
                :width="width"
                :height="height"
                fixed
              />
            </template>
          </el-auto-resizer>
        </div>
        <div class="w-1/4 h-full bg-white px-2">
          <div class="file-info flex flex-col gap-2">
            <div>文件名</div>
            <div>{{ file.name }}</div>
            <div>文件字节数</div>
            <div>{{ file.size }}</div>
            <div>文件地址</div>
            <div class="break-all">{{ fileurl }}</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { TmsFile } from '@/types'
import utils from '@/utils'
import { h, PropType, ref } from 'vue'
import '../assets/preview.css'
//@ts-ignore
import Papa from 'papaparse'

const props = defineProps({
  file: { type: Object as PropType<TmsFile>, required: true },
})
const dialogVisible = ref(true)
const rowHeight = ref<number>(50)
// 文档列
let csvHeaders: string[] | undefined
const tableColumns = ref<any>([])
const tableRows = ref<any>([])

// 文件地址
const fileurl = utils.getFileUrl(props.file)

const csv2TableData = () => {
  if (csvHeaders?.length === 0) return
  csvHeaders?.forEach((header: string) => {
    tableColumns.value.push({
      key: header,
      title: header,
      width: 100,
      cellRenderer: ({
        rowData,
        rowIndex,
        columnIndex,
      }: {
        rowData: any
        rowIndex: number
        columnIndex: number
      }) => {
        return h('div', {}, rowData[csvHeaders![columnIndex]])
      },
    })
  })
}
/**
 * CSV解析
 */
let index = 0
Papa.parse(fileurl, {
  download: true,
  step: (row: { data: any[] }) => {
    if (index === 0) csvHeaders = row.data
    else {
      let tableRow = row.data.reduce(
        (obj: Record<string, any>, rd: any, i: number) => {
          obj[csvHeaders![i]] = rd
          return obj
        },
        {}
      )
      console.log(tableRow)
      tableRows.value.push(tableRow)
    }
    index++
  },
  complete: () => {
    console.log('[tms-finder] 完成CSV解析')
    csv2TableData()
  },
})
</script>
