<script setup lang="ts">
import { onMounted, reactive, ref, toRaw } from 'vue'
import { useStore } from '@/stores/store'
import DatagroupList from '@/components/DatagroupList.vue'
import EditDataset from '@/components/EditDataset.vue'
import EditDatagroup from '@/components/EditDatagroup.vue'
import DeleteDatagroup from '@/components/DeleteDatagroup.vue'
import DropdownMenu from '@/components/DropdownMenu.vue'
import { format } from 'date-fns'
import {
  BucketDropletIcon,
  DeviceFloppyIcon,
  DotsVerticalIcon,
  DownloadIcon,
  InfoCircleFilledIcon,
  PlusIcon,
  UploadIcon
} from 'vue-tabler-icons'
import { getDatabase, ref as fireRef, get, child, set, update } from 'firebase/database'
import { notify } from '@kyvg/vue3-notification'
import type { Dataset, Datagroup } from '@/types/index.d'

interface State {
  dataset: Dataset | null
  datagroup: Datagroup | null
  editDatasetModalVisible: boolean
  editDatagroupModalVisible: boolean
  deleteDatagroupModalVisible: boolean
}

const db = getDatabase()
const dbRef = fireRef(db)
const store = useStore()
const datagroupListRef = ref<InstanceType<typeof DatagroupList> | null>(null)

const state = reactive<State>({
  dataset: null,
  datagroup: null,
  editDatasetModalVisible: false,
  editDatagroupModalVisible: false,
  deleteDatagroupModalVisible: false
})

const beforeUnload = (e: BeforeUnloadEvent): void => {
  e.preventDefault()
  e.returnValue = ''
}

function editDatagroup(datagroup: Datagroup): void {
  state.datagroup = datagroup
  state.editDatagroupModalVisible = true
}

function deleteDatagroup(datagroup: Datagroup): void {
  state.datagroup = datagroup
  state.deleteDatagroupModalVisible = true
}

function createNewDatagroup(): void {
  state.datagroup = getNewDatagroup()
  state.editDatagroupModalVisible = true
}

function createNewDataset(): void {
  state.dataset = getNewDataset()
  state.editDatasetModalVisible = true
}

function saveInDatabase(): void {
  set(fireRef(db, 'datagroups'), toRaw(store.datagroups))
    .then(() => {
      window.removeEventListener('beforeunload', beforeUnload)

      notify({
        title: 'Die Daten wurden gespeichert',
        type: 'success'
      })
    })
    .catch((error: Error) => {
      console.log('Save error', error)

      notify({
        title: 'Es ist ein Fehler aufgetreten',
        type: 'error'
      })
    })
}

function getNewDatagroup(): Datagroup {
  return {
    active: true,
    datasets: [],
    id: null,
    title: ''
  }
}

function getNewDataset() {
  return {
    actualAmount: 0,
    debitAmount: 0,
    diffAmount: 0,
    groupId: 0,
    id: null,
    interval: '',
    invoiceAmount: 0,
    invoiceDate: null,
    lastInvoiceDate: null,
    lastUpdateDate: null,
    monthlyAmount: 0,
    title: '',
    type: 1,
    updateAmount: 0,
    updateType: 'add'
  }
}

function loadData() {
  const fileInput = document.createElement('input')
  fileInput.setAttribute('type', 'file')

  fileInput.addEventListener('change', (e) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const target = event.target as FileReader
      if (target && typeof target.result === 'string') {
        const resultJSON = JSON.parse(target.result)
        store.datagroups = resultJSON.datagroups
      }
    }

    const target = e.target as HTMLInputElement
    if (target.files) {
      reader.readAsText(target.files[0])
    }
  })

  fileInput.click()
}

function downloadAsJSON() {
  const a = document.createElement('a')
  const file = new Blob([JSON.stringify({ datagroups: store.datagroups })], { type: 'text/plain' })

  a.href = URL.createObjectURL(file)
  a.download = `billbird-data-${format(new Date(), 'yyyy-MM-dd')}.json`
  a.click()
}

onMounted(() => {
  if (store.uid === 'testuser') {
    fetch('/timo.json')
      .then((response) => response.json())
      .then((data) => (store.datagroups = data.datagroups))
      .catch((e) => {
        fetch('/data.json')
          .then((response) => response.json())
          .then((data) => (store.datagroups = data.datagroups))
          .catch((e) => {
            console.log(e)
          })
      })
  } else {
    get(child(dbRef, '/'))
      .then(async (snapshot) => {
        if (snapshot.exists()) {
          store.datagroups = snapshot.val().datagroups
        } else {
          return Promise.reject('Lesen aus der Datenbank fehlgeschlagen')
        }
      })
      .catch((error) => {
        console.error(error)

        notify({
          title: error,
          type: 'error'
        })
      })
  }
})

const menuItems = reactive([
  {
    label: 'Ausfüllen',
    onClick: () => fillUpdateFields()
  },
  {
    label: 'JSON herunterladen',
    onClick: () => downloadAsJSON()
  },
  {
    label: 'JSON laden',
    onClick: () => loadData()
  },
  {
    label: 'Neue Datengruppe',
    onClick: () => createNewDatagroup()
  },
  {
    label: 'Neuer Datensatz',
    onClick: () => createNewDataset()
  },
  {
    label: 'Speichern',
    onClick: () => saveInDatabase(),
    disabled: store.isLoggedIn === false
  }
])

const createItemMenuItems = reactive([
  {
    label: 'Datengruppe',
    onClick: () => createNewDatagroup()
  },
  {
    label: 'Datensatz',
    onClick: () => createNewDataset()
  }
])

function fillUpdateFields() {
  if (datagroupListRef.value) datagroupListRef.value.fillUpdateFields()
}
</script>

<template>
  <div class="view-container">
    <ModalWindow
      :show="state.editDatasetModalVisible"
      @close="state.editDatasetModalVisible = false"
    >
      <EditDataset
        v-if="state.dataset"
        :dataset="state.dataset"
        @close="state.editDatasetModalVisible = false"
      />
    </ModalWindow>

    <ModalWindow
      :show="state.editDatagroupModalVisible"
      @close="state.editDatagroupModalVisible = false"
    >
      <EditDatagroup
        v-if="state.datagroup"
        :datagroup="state.datagroup"
        @close="state.editDatagroupModalVisible = false"
      />
    </ModalWindow>

    <ModalWindow
      :show="state.deleteDatagroupModalVisible"
      max-width="400px"
      @close="state.deleteDatagroupModalVisible = false"
    >
      <DeleteDatagroup
        v-if="state.datagroup"
        :datagroup="state.datagroup"
        @close="state.deleteDatagroupModalVisible = false"
      />
    </ModalWindow>

    <div class="messages">
      <div class="message info" v-if="!store.isLoggedIn">
        <div class="icon">
          <InfoCircleFilledIcon></InfoCircleFilledIcon>
        </div>
        <div class="content">
          Der Gastzugang dient nur Demonstrationszwecken. Einige Funktionalitäten sind nur
          eingeschränkt oder gar nicht nutzbar.
        </div>
      </div>
    </div>

    <nav>
      <div class="mobile-nav">
        <DropdownMenu :menuItems="menuItems">
          <DotsVerticalIcon class="w-5 h-5 mx-auto" />
        </DropdownMenu>
      </div>

      <ul class="desktop-nav">
        <li>
          <a @click="fillUpdateFields">
            <BucketDropletIcon />
            <span>Ausfüllen</span>
          </a>
        </li>
        <li>
          <a @click="downloadAsJSON">
            <DownloadIcon />
            <span>JSON herunterladen</span>
          </a>
        </li>
        <li>
          <a @click="loadData">
            <UploadIcon />
            <span>JSON laden</span>
          </a>
        </li>
        <li>
          <DropdownMenu :menuItems="createItemMenuItems">
            <div class="dropdown-trigger-button">
              <PlusIcon />
              <span>Neu</span>
            </div>
          </DropdownMenu>
        </li>
        <li>
          <a
            v-on="store.isLoggedIn ? { click: saveInDatabase } : {}"
            :class="{ disabled: !store.isLoggedIn }"
          >
            <DeviceFloppyIcon />
            <span>Speichern</span>
          </a>
        </li>
      </ul>
    </nav>

    <DatagroupList
      ref="datagroupListRef"
      v-if="store.datagroups.length"
      @editDatagroup="(datagroup) => editDatagroup(datagroup)"
      @deleteDatagroup="(datagroup) => deleteDatagroup(datagroup)"
    />
    <div v-else>
      <p>Keine Datensätze vorhanden</p>
    </div>

    <div class="buttons">
      <button @click="createNewDatagroup" class="button w-full large">
        <span><PlusIcon /></span>
        <span>Neue Datengruppe</span>
      </button>
      <button @click="createNewDataset" class="button w-full large">
        <span><PlusIcon /></span>
        <span>Neuer Datensatz</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

body {
  overflow-y: scroll;
}

.view-container {
  padding: 0.75rem 0.75rem 0;
  max-width: 2000px;
  margin: 2rem auto;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2.5rem;

  .message {
    display: flex;
    align-items: center;
    border-radius: $global-radius;
    border: 1px solid;
    padding: 1rem;
    gap: 0.5rem;

    .icon {
      flex: 0 1 auto;
    }

    .content {
      flex: 1;
    }

    &.info {
      border-color: lighten($info-color, 40%);
      background-color: lighten(rgba($info-color, 0.15), 40%);
      color: $info-color;
    }
  }
}

nav {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 0.5rem;
}

.mobile-nav {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  padding-right: 0.5rem;

  @media (min-width: $md) {
    display: none;
  }
}

.desktop-nav {
  display: none;

  a {
    display: flex;
    gap: 0.25rem;
  }

  @media (min-width: $md) {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1.75rem;
  }
}

.dropdown-trigger-button {
  display: flex;
  gap: 0.25rem;
}

.buttons {
  button {
    margin-top: 0.75rem;
    display: inline-flex;
    justify-content: center;
    align-items: center;

    svg {
      width: 1.25rem;
      height: 1.25rem;
      margin-right: 0.5rem;
    }

    @media (min-width: 640px) {
      width: auto;

      &:nth-of-type(1) {
        margin-right: 0.75rem;
      }
    }
  }
}
</style>
