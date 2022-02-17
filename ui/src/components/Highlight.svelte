<script>
  import highlighter from 'hit-highlighter';
  import '../styles/highlight.css';

  export let search = '';
  export let text = '';

  const highlighted = highlighter(
    [search],
     text.split(' ').map(v => v.trim()),
     { highlightStart: '<span class="highlighted">@', }
  );

</script>

{@html highlighted}
