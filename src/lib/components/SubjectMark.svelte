<script>
  export let subject = 'physics';
  export let accent = ''; // kept for compatibility, no longer used with raster icons
  export let size = 32;

  const icons = {
    physics: '/images/icon-physics.png',
    maths: '/images/icon-maths.png',
    chemistry: '/images/icon-chemistry.png'
  };

  $: src = icons[subject] || icons.physics;
</script>

<img src={src} alt={subject} width={size} height={size} style="display:block;border-radius:10px;background:#121118" />
