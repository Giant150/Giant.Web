<template>
  <a-list item-layout="horizontal" :data-source="commits">
    <a-list-item slot="renderItem" slot-scope="item">
      <a-list-item-meta :description="item | desc">
        <a slot="title" :href="item.html_url">{{ item.commit.message }}</a>
        <a-avatar slot="avatar" :src="item.committer.avatar_url" />
      </a-list-item-meta>
    </a-list-item>
  </a-list>
</template>

<script>
export default {
  data() {
    return {
      commits: [{
        commit: {
          committer: {
            name: '刘巨',
            email: 'liuju150@outlook.com',
            date: '2021-04-07T06:08:06Z'
          },
          message: 'SKU'
        },
        html_url: 'https://github.com/LiuJu150/Giant.Web/commit/e7bc22d22b0c9b2a3cd0f007df8ceeea61201a30',
        committer: {
          avatar_url: 'https://avatars.githubusercontent.com/u/53262973?v=4',
          url: 'https://api.github.com/users/LiuJu150',
          html_url: 'https://github.com/LiuJu150',
          followers_url: 'https://api.github.com/users/LiuJu150/followers'
        }
      }]
    }
  },
  filters: {
    desc(item) {
      return `提交人:${item.commit.committer.name}(${item.commit.committer.email}) 提交时间:${item.commit.committer.date}`
    }
  },
  mounted() {
    // this.$http.get('https://api.github.com/repos/LiuJu150/Giant.Web/commits').then(result => {
    //   this.commits = result
    // })
  }
}
</script>

<style>
</style>
