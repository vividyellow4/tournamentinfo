#!/usr/bin/env python3

# Read the current file
with open('index.html', 'r') as f:
    content = f.read()

# Find the script section and replace it
script_start = content.find('<script>')
script_end = content.find('</script>') + len('</script>')

new_script = '''  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'] },
          colors: {
            brand: {
              50: '#edfaff', 100: '#d6f0ff', 200: '#aee1ff', 300: '#7ecbff',
              400: '#4eb0ff', 500: '#1f90ff', 600: '#0f73db', 700: '#0b5ab0',
              800: '#0b4a8e', 900: '#0c3f75'
            },
            matchnavy: {
              50: '#f8faff',
              100: '#f1f5ff',
              200: '#e5edff',
              300: '#d1ddff',
              400: '#b8c7ff',
              500: '#9aa8ff',
              600: '#7c8aff',
              700: '#5e6cff',
              800: '#01286a',  // Your original color
              900: '#001a4a'   // Darker version
            },
            matchyellow: {
              50: '#fefce8',
              100: '#fef9c3',
              200: '#fef08a',
              300: '#fde047',
              400: '#fcc91c',  // Your original color
              500: '#eab308',
              600: '#ca8a04',
              700: '#a16207',
              800: '#854d0e',
              900: '#713f12'
            }
          },
          boxShadow: { sporty: '0 10px 20px -10px rgba(0,0,0,0.25)' }
        }
      }
    }
  </script>'''

# Replace the script section
new_content = content[:script_start] + new_script + content[script_end:]

# Write the new content
with open('index.html', 'w') as f:
    f.write(new_content)

print("Successfully added matchyellow palette to Tailwind config")
