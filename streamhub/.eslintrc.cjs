module.exports = {
  root:true, env:{ browser:true, es2021:true, node:true },
  parser:'@typescript-eslint/parser',
  plugins:['@typescript-eslint','react','react-hooks','import','n','prettier'],
  extends:['plugin:@typescript-eslint/recommended','plugin:react/recommended','plugin:react-hooks/recommended','plugin:import/recommended','plugin:n/recommended','prettier'],
  settings:{ react:{ version:'detect' } },
  rules:{ 'react/prop-types':'off','prettier/prettier':['warn'] }
}
