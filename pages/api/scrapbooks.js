import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequests(request, response) {

    if(request.method === 'POST'){
        const TOKEN = 'd137198fddafa0660c2bc18b8eb89a'
        const client = new SiteClient(TOKEN)

        // Validar os dados, antes de sair cadastrando
        const registroCriado = await client.items.create({
            itemType: '976205',
            ...request.body,
        })

        console.log(registroCriado)

        response.json({
            dados: 'Algum dado Qualquer',
            registroCriado: registroCriado
        })
        return;
    }

    response.status(404).json({
        message: 'Ainda não temos nada no GET, mas no POST tem!'
    })
}