for d in docs versioned_docs/version-4.0 versioned_docs/version-3.0; do
  for s in cms file; do
    [ -d "$d/$s/inc" ] && git mv "$d/$s/inc" "$d/$s/_inc"
  done
done

grep -rl "from './inc/" docs versioned_docs | xargs sed -i "s|from '\./inc/|from './_inc/|g"