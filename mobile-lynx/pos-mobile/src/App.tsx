import { useCallback, useEffect, useState } from '@lynx-js/react'

import './App.css'
import lynxLogo from './assets/lynx-logo.png'

export function App() {
  const [currentTab, setCurrentTab] = useState('inicio')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [currentDebtTab, setCurrentDebtTab] = useState('por_cobrar')
  const [currentBalanceTab, setCurrentBalanceTab] = useState('ingresos')
  const [selectedDate, setSelectedDate] = useState('07 mar')

  useEffect(() => {
    console.info('POS App Initialized')
  }, [])

  const handleLogin = useCallback(() => {
    'background only'
    if (username && password) {
      setIsLoggedIn(true)
    }
  }, [username, password])

  const handleTabChange = useCallback((tab: string) => {
    'background only'
    setCurrentTab(tab)
  }, [])

  const handleDebtTabChange = useCallback((tab: string) => {
    'background only'
    setCurrentDebtTab(tab)
  }, [])

  const handleBalanceTabChange = useCallback((tab: string) => {
    'background only'
    setCurrentBalanceTab(tab)
  }, [])

  const handleDateChange = useCallback((date: string) => {
    'background only'
    setSelectedDate(date)
  }, [])

  const renderLoginScreen = () => {
    return (
      <view className="LoginScreen">
        <view className="LoginForm">
          <image src={lynxLogo} className="LoginLogo" />
          <text className="LoginTitle">POS System</text>
          
          <view className="InputContainer">
            <text className="InputLabel">Usuario</text>
            <input 
              className="TextInput" 
              placeholder="Ingresa tu usuario"
              value={username}
              onInput={(e) => setUsername(e.target.value)}
            />
          </view>
          
          <view className="InputContainer">
            <text className="InputLabel">Contraseña</text>
            <input 
              className="TextInput" 
              placeholder="Ingresa tu contraseña"
              type="password"
              value={password}
              onInput={(e) => setPassword(e.target.value)}
            />
          </view>
          
          <button className="LoginButton" bindtap={handleLogin}>
            <text className="ButtonText">Iniciar Sesión</text>
          </button>
        </view>
      </view>
    )
  }

  const renderHeader = () => {
    return (
      <view className="Header">
        <view className="BusinessInfo">
          <view className="Avatar">
            <text>👤</text>
          </view>
          <view>
            <text className="BusinessName">Varas Grill</text>
            <text className="BusinessRole">Propietario</text>
          </view>
        </view>
        <view>
          {currentTab === 'deudas' || currentTab === 'balance' ? (
            <text>⚙️</text>
          ) : (
            <text>❓</text>
          )}
        </view>
      </view>
    )
  }

  const renderHomeScreen = () => {
    return (
      <view className="Dashboard">
        <text className="SectionTitle">Accesos rápidos</text>
        <view className="QuickAccessGrid">
          <view className="QuickAccessCard" bindtap={() => handleTabChange('ventas')}>
            <text className="QuickAccessIcon">📈</text>
            <text className="QuickAccessLabel">Registrar Venta</text>
          </view>
          <view className="QuickAccessCard" bindtap={() => handleTabChange('gastos')}>
            <text className="QuickAccessIcon">📉</text>
            <text className="QuickAccessLabel">Registrar Gasto</text>
          </view>
          <view className="QuickAccessCard" bindtap={() => handleTabChange('menu')}>
            <text className="QuickAccessIcon">🍽️</text>
            <text className="QuickAccessLabel">Ver Menú</text>
          </view>
        </view>

        <view className="PromotionCard">
          <view className="PromotionText">
            <text className="PromotionTitle">¡Mejora tu operación!</text>
            <text className="PromotionDescription">Con nuestro plan pago imprime tickets de tus ventas.</text>
          </view>
          <view className="PromotionButton">
            <text className="PromotionButtonText">Explorar planes</text>
          </view>
        </view>

        <view className="SuggestionsSection">
          <text className="SectionTitle">Sugeridos para ti</text>
          <view className="SuggestionsGrid">
            <view className="SuggestionCard" bindtap={() => handleTabChange('mesas')}>
              <text className="SuggestionIcon">🍽️</text>
              <text className="SuggestionLabel">Mesas</text>
            </view>
            <view className="SuggestionCard" bindtap={() => handleTabChange('deudas')}>
              <text className="SuggestionIcon">💰</text>
              <text className="SuggestionLabel">Deudas</text>
            </view>
            <view className="SuggestionCard" bindtap={() => handleTabChange('estadisticas')}>
              <text className="SuggestionIcon">📊</text>
              <text className="SuggestionLabel">Estadísticas</text>
            </view>
            <view className="SuggestionCard" bindtap={() => handleTabChange('clientes')}>
              <text className="SuggestionIcon">👥</text>
              <text className="SuggestionLabel">Clientes</text>
            </view>
          </view>
        </view>
      </view>
    )
  }

  const renderBalanceScreen = () => {
    return (
      <view className="BalanceScreen">
        <view className="DateSelector">
          <view 
            className={`DateOption ${selectedDate === '04 mar' ? 'DateOptionActive' : ''}`}
            bindtap={() => handleDateChange('04 mar')}
          >
            <text>04 mar</text>
          </view>
          <view 
            className={`DateOption ${selectedDate === '05 mar' ? 'DateOptionActive' : ''}`}
            bindtap={() => handleDateChange('05 mar')}
          >
            <text>05 mar</text>
          </view>
          <view 
            className={`DateOption ${selectedDate === '06 mar' ? 'DateOptionActive' : ''}`}
            bindtap={() => handleDateChange('06 mar')}
          >
            <text>06 mar</text>
          </view>
          <view 
            className={`DateOption ${selectedDate === '07 mar' ? 'DateOptionActive' : ''}`}
            bindtap={() => handleDateChange('07 mar')}
          >
            <text>07 mar</text>
          </view>
        </view>

        <view className="BalanceCard">
          <text className="BalanceTitle">Balance</text>
          <text className="BalanceAmount">$ 3</text>

          <view className="BalanceRow">
            <view className="BalanceLabel">
              <text>📈</text>
              <text>Ingresos</text>
            </view>
            <text>$ 3</text>
          </view>

          <view className="BalanceRow">
            <view className="BalanceLabel">
              <text>📉</text>
              <text>Egresos</text>
            </view>
            <text>$ 0</text>
          </view>

          <view className="BalanceActions">
            <text className="BalanceLink">Descargar Reportes</text>
            <text className="BalanceLink">Ver Balance ></text>
          </view>
        </view>

        <view className="TransactionsList">
          <view className="TransactionTabs">
            <view 
              className={`TransactionTab ${currentBalanceTab === 'ingresos' ? 'TransactionTabActive' : ''}`}
              bindtap={() => handleBalanceTabChange('ingresos')}
            >
              <text>Ingresos</text>
            </view>
            <view 
              className={`TransactionTab ${currentBalanceTab === 'egresos' ? 'TransactionTabActive' : ''}`}
              bindtap={() => handleBalanceTabChange('egresos')}
            >
              <text>Egresos</text>
            </view>
          </view>

          {currentBalanceTab === 'ingresos' ? (
            <view className="TransactionItem">
              <view className="TransactionIcon">
                <text>💵</text>
              </view>
              <view className="TransactionInfo">
                <text className="TransactionName">Gghhhh</text>
                <text className="TransactionDetails">Transferencia · 07 de mar - 06:04 am</text>
              </view>
              <view>
                <text className="TransactionAmount">$ 3</text>
                <text className="TransactionStatus">Pagado</text>
              </view>
            </view>
          ) : (
            <view className="EmptyState">
              <text className="EmptyStateTitle">No hay egresos registrados</text>
            </view>
          )}
        </view>

        <view className="ActionButtons">
          <button className="ActionButton ActionButtonPrimary">
            <text className="ButtonText">Nueva venta</text>
          </button>
          <button className="ActionButton ActionButtonSecondary">
            <text className="ButtonText">Nuevo gasto</text>
          </button>
        </view>
      </view>
    )
  }

  const renderDebtScreen = () => {
    return (
      <view className="DebtScreen">
        <view className="DebtTabs">
          <view 
            className={`DebtTab ${currentDebtTab === 'por_cobrar' ? 'DebtTabActive' : ''}`}
            bindtap={() => handleDebtTabChange('por_cobrar')}
          >
            <text>Por cobrar</text>
          </view>
          <view 
            className={`DebtTab ${currentDebtTab === 'por_pagar' ? 'DebtTabActive' : ''}`}
            bindtap={() => handleDebtTabChange('por_pagar')}
          >
            <text>Por pagar</text>
          </view>
        </view>

        <view className="EmptyState">
          <view className="EmptyStateIcon">
            <text>💰</text>
          </view>
          <text className="EmptyStateTitle">
            {currentDebtTab === 'por_cobrar' 
              ? 'No tienes deudas por cobrar' 
              : 'No tienes deudas por pagar'}
          </text>
          <text className="EmptyStateMessage">
            {currentDebtTab === 'por_cobrar' 
              ? 'Créalas en "Nueva venta"' 
              : 'Créalas en "Nuevo gasto"'}
          </text>
        </view>

        <view className="ActionButtons">
          <button className="ActionButton ActionButtonPrimary">
            <text className="ButtonText">Nueva venta</text>
          </button>
          <button className="ActionButton ActionButtonSecondary">
            <text className="ButtonText">Nuevo gasto</text>
          </button>
        </view>
      </view>
    )
  }

  const renderMenuScreen = () => {
    return (
      <view className="Dashboard">
        <text className="DashboardTitle">Menú</text>
        <text>Contenido del menú en desarrollo</text>
      </view>
    )
  }

  const renderTabContent = () => {
    switch (currentTab) {
      case 'inicio':
        return renderHomeScreen()
      case 'balance':
        return renderBalanceScreen()
      case 'deudas':
        return renderDebtScreen()
      case 'menu':
        return renderMenuScreen()
      default:
        return renderHomeScreen()
    }
  }

  const renderTabBar = () => {
    return (
      <view className="TabBar">
        <view 
          className={`TabItem ${currentTab === 'inicio' ? 'TabItem--active' : ''}`}
          bindtap={() => handleTabChange('inicio')}
        >
          <text className="TabIcon">🏠</text>
          <text className="TabText">Inicio</text>
        </view>
        <view 
          className={`TabItem ${currentTab === 'balance' ? 'TabItem--active' : ''}`}
          bindtap={() => handleTabChange('balance')}
        >
          <text className="TabIcon">📊</text>
          <text className="TabText">Balance</text>
        </view>
        <view 
          className={`TabItem ${currentTab === 'deudas' ? 'TabItem--active' : ''}`}
          bindtap={() => handleTabChange('deudas')}
        >
          <text className="TabIcon">💰</text>
          <text className="TabText">Deudas</text>
        </view>
        <view 
          className={`TabItem ${currentTab === 'menu' ? 'TabItem--active' : ''}`}
          bindtap={() => handleTabChange('menu')}
        >
          <text className="TabIcon">🍽️</text>
          <text className="TabText">Menú</text>
        </view>
        <view 
          className={`TabItem ${currentTab === 'explorar' ? 'TabItem--active' : ''}`}
          bindtap={() => handleTabChange('explorar')}
        >
          <text className="TabIcon">🔍</text>
          <text className="TabText">Explorar</text>
        </view>
      </view>
    )
  }

  const renderMainApp = () => {
    return (
      <view className="MainApp">
        {renderHeader()}
        <view className="AppContent">
          {renderTabContent()}
        </view>
        {renderTabBar()}
      </view>
    )
  }

  return (
    <view>
      <view className='Background' />
      {isLoggedIn ? renderMainApp() : renderLoginScreen()}
    </view>
  )
}
