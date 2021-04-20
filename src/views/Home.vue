<template>
  <a-list item-layout="horizontal" rowKey="node_id" :dataSource="commits" :grid="{gutter: 24, lg: 4, md: 3, sm: 1, xs: 1}">
    <a-list-item slot="renderItem" slot-scope="item">
      <a-card :hoverable="true">
        <a-card-meta>
          <a slot="title" :href="item.committer?item.committer.html_url:''" target="_blank">{{ item.commit.committer.name }}</a>
          <a-avatar class="card-avatar" slot="avatar" :src="item.committer?item.committer.avatar_url:''" size="large" />
          <div class="meta-content" slot="description">
            <h1>{{ item.commit.message }}</h1>
          </div>
        </a-card-meta>
        <template class="ant-card-actions" slot="actions">
          <a :href="'mailto:'+item.commit.committer.email" target="_blank">{{ item.commit.committer.email }}</a>
          <a :href="item.html_url" target="_blank">{{ moment(item.commit.committer.date).format('lll') }}</a>
        </template>
      </a-card>
    </a-list-item>
  </a-list>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  data() {
    return {
      commits: []
    }
  },
  filters: {
    desc(item) {
      return `提交人:${item.commit.committer.name}(${item.commit.committer.email}) 提交时间:${item.commit.committer.date}`
    }
  },
  mounted() {
    axios({
      url: '/repos/LiuJu150/Giant.Web/commits?per_page=16',
      method: 'get',
      baseURL: 'https://api.github.com',
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    }).then(result => {
      if (result.status === 200) {
        this.commits = result.data
      }
    })
  },
  methods: {
    moment
  }
}
</script>

<style>
</style>
