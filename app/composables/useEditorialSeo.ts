import type { MaybeRefOrGetter } from 'vue'
import { safeWebUrl } from '~/utils/render-markdown'
export function useEditorialSeo(
  title: MaybeRefOrGetter<string>,
  description: MaybeRefOrGetter<string>,
  image?: MaybeRefOrGetter<string | undefined>,
  path?: MaybeRefOrGetter<string>,
  article = false,
) {
  const route = useRoute()
  const canonical = computed(
    () => 'https://blichstudio.com' + (path ? toValue(path) : route.path),
  )
  const pageTitle = computed(() => toValue(title) + ' | Blich Studio')
  const socialImage = computed(
    () =>
      safeWebUrl(image ? toValue(image) : undefined) ||
      'https://blichstudio.com/og-image.png',
  )
  useSeoMeta({
    title: pageTitle,
    description: () => toValue(description),
    ogTitle: pageTitle,
    ogDescription: () => toValue(description),
    ogUrl: canonical,
    ogType: article ? 'article' : 'website',
    ogImage: socialImage,
    twitterCard: 'summary_large_image',
    twitterTitle: pageTitle,
    twitterDescription: () => toValue(description),
    twitterImage: socialImage,
  })
  useHead(() => ({ link: [{ rel: 'canonical', href: canonical.value }] }))
}
