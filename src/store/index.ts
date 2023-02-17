import useUser from '@/store/modules/user';
import usePermission from '@/store/modules/permission';
import useApp from '@/store/modules/app';
import useTagsView from '@/store/modules/tagView';
import useSearchModel from '@/store/modules/search';
const useStore = () => ({
  user: useUser(),
  permission: usePermission(),
  app: useApp(),
  tagsView: useTagsView(),
  searchModel: useSearchModel()
});
export default useStore;
