# #!/usr/bin/sh
#
# # Instala as dependências do projeto.
# npm install
#
# # Instala as dependências.
# echo -------------------------------------------------------------------
# echo [01/06] Dependencias
# echo -------------------------------------------------------------------
# npm install --global @ui5/cli
# npm install --save-dev nwabap-ui5uploader
# npm install --save-dev ui5-test-runner
# npm audit fix
#
# # Antes de executar, iniciar servidor com dados mock.
# # No Linux, coloque um "&" no final para executar em background.
# echo -------------------------------------------------------------------
# echo [02/06] Subindo servidor Web em background para executar os testes
# echo -------------------------------------------------------------------
# ui5 serve --config ui5-mock.yaml --port 8085 &
#
# # Testes unitários.
# echo -------------------------------------------------------------------
# echo [03/06] Executando testes unitários
# echo -------------------------------------------------------------------
# npx ui5-test-runner --url http://localhost:8085/test/unit/unitTests.qunit.html >> unit.txt
# cat unit.txt
#
# # Define o arquivo que será analisado.
# FILE="unit.txt"
#
# # Define a mensagem que será procurada no arquivo.
# STRING="failed, expected argument to be truthy"
#
# # Verifica se a mensagem de erro existe no arquivo.
# if grep -q "$STRING" "$FILE" ; then
#
#   # Informa que ocorreu erro no teste unitário.
#   echo 'Teste Unitário: Erro, faça o teste localmente, ajuste o problema e tente novamente'
#
#   # Encerra a execução do script com código de erro.
#   exit 1
#
# else
#
#   # Informa que o teste unitário foi executado com sucesso.
#   echo 'Teste Unitário: OK'
# fi
#
# # Testes integrados.
# echo -------------------------------------------------------------------
# echo [04/06] Executando testes integrados
# echo -------------------------------------------------------------------
# npx ui5-test-runner --url http://localhost:8085/test/integration/opaTests.qunit.html >> integration.txt
# cat integration.txt
#
# # Define o arquivo que será analisado.
# FILE="integration.txt"
#
# # Define a mensagem que será procurada no arquivo.
# STRING="Callstack"
#
# # Verifica se a mensagem de erro existe no arquivo.
# if grep -q "$STRING" "$FILE" ; then
#
#   # Informa que ocorreu erro no teste de integração.
#   echo 'Teste de Integração: Erro, faça o teste localmente, ajuste o problema e tente novamente'
#
#   # Encerra a execução do script com código de erro.
#   exit 1
#
# else
#
#   # Informa que o teste de integração foi executado com sucesso.
#   echo 'Teste de Integração: OK'
# fi
#
# # Executar build.
# echo -------------------------------------------------------------------
# echo [05/06] Executando build
# echo -------------------------------------------------------------------
# ui5 build
#
# # Deploy.
# echo -------------------------------------------------------------------
# echo [06/06] Executando deploy
# echo -------------------------------------------------------------------
# npx nwabap upload