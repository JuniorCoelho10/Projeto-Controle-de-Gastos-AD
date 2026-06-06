
// Seleciona os elementos do formulário.
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// Seleciona os elementos da lista.
const expenseList = document.querySelector("ul")
const expensesQuantity = document.querySelector("aside header p span")
 const expensesTotal = document.querySelector(" aside header h2 span")

amount.oninput = () => {
  let value = amount.value.replace(/\D/g, "")

  value = Number(value) / 100
  
  amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
  value = value.toLocaleString ("pt-BR", {
    style: "currency",
    currency:"BRL",

  })

  return value
}

// Captura o evento de submit do formulário para obter os valores.
form.onsubmit = (event) => {
  event.preventDefault()

  const  newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),

  }


  expenseAdd(newExpense)
}

// Adiciona um novo item na lista.
function expenseAdd(newExpense) {
  try {

    // Cria o elemento para adicionar o item (li) na  lista (ul).
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

// Cria o icone da categoria.
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

    // Cria a info da despesa.
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    // Cria o nome da despesa.
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    // Cria a categoria da despesa.
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    

    // Adiciona as informações das despesas na div.
    expenseInfo.append(expenseName,expenseCategory)


    // Cria o valor da despesa 
    const expenseAmount =  document.createElement("span")
    expenseAmount.classList.add("expense-amount")

    // Acrescenta o conteudo dentro do "span" e remove o R$  para nao ficar duplicado(acima foi formatado com R$ entao é necessario remove-lo)
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`
    
    // Cria icone de remover despesa.
    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "img/remove.svg" )
    removeIcon.setAttribute("alt", "Icone de remover")

    // removeIcon.addEventListener("click", () => {
    //   expenseInfo.remove()
    // })


    // Adiciona as informações no item.
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)
    
    // Adiciona o item na lista.
    expenseList.append(expenseItem)

    // Atualiza os totais.
    updateTotals()

    // Limpa o formulario apos adicionar um novo item na lista.
    formClear()


  } catch (error) {
    alert("Não foi possivel atualizar a lista de despesas.")
    console.log(error)
  }


  
}

// Atualizar os totais.

function updateTotals() {
  try {

    // Recupera todos os itens (li) da lista (ul).
    const items = expenseList.children

    // Atualiza a quantidade de despesas da lista.
    expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"} `

    // Variavel para incrementar o total.
    let total = 0

    // Percorre cada item (li) da lista (ul).
    for (let item = 0; item < items.length; item++) {
       const ItemAmount =items[item].querySelector(".expense-amount")
      
       
      // Remove caracteres não numericos e substitui a virgula por ponto.
       let value = ItemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

       // Converte o valor para float.
        value = parseFloat(value)

        // Verifica se é um numero valido.
        if (isNaN(value)){
          return alert ("Não foi possivel calcular o total. O valor não parece ser um numero.")
        }

        // Incremetar o total .

        total +=(value)

      

    }



    total = formatCurrencyBRL(total)
    expensesTotal.textContent = total

    
  } catch (error) {
    console.log(error)
    alert("Não foi possivel atualizar os totais.")    
  }
}


  // Evento que captura o click nos itens da lista(remover).

  expenseList.addEventListener("click", (event) => {

    // Verificar se o elemento clciado é o icone de remover.

    if (event.target.classList.contains("remove-icon")){
      
      // Obtem a li pai do elemento clicado.
      const item = event.target.closest(".expense")

      // Remove item da lista
      item.remove()
    }

    // Atualiza os totais.
    updateTotals()

    
  })


function formClear() {
  // Limpa os inputs.
  expense.value = ""
  category.value = ""
  amount.value = ""

  // Coloca o foco no input.
  expense.focus()


}

// Salvar relatório em PDF
const savePdfButton = document.getElementById("save-pdf")

savePdfButton.addEventListener("click", () => {
  const element = document.querySelector("aside")

  const options = {
    margin: 10,
    filename: "relatorio-despesas.pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  }

  html2pdf().set(options).from(element).save()
})