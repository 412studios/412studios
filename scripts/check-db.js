const { PrismaClient } = require('@prisma/client');

async function checkDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Count bookings
    const bookingCount = await prisma.bookings.count();
    console.log(`📊 Total bookings: ${bookingCount}`);
    
    // Count successful bookings
    const successfulBookings = await prisma.bookings.count({
      where: { status: 'success' }
    });
    console.log(`✅ Successful bookings: ${successfulBookings}`);
    
    // Count bookings without calendar sync (empty addDetails)
    const unsyncedBookings = await prisma.bookings.count({
      where: {
        status: 'success',
        addDetails: '', // Only empty strings since addDetails is non-nullable
      },
    });
    console.log(`📅 Bookings not synced to calendar: ${unsyncedBookings}`);
    
    // Test a simple query with user join
    const sampleBookings = await prisma.bookings.findMany({
      where: { status: 'success' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      take: 3,
    });
    console.log(`🔍 Sample bookings found: ${sampleBookings.length}`);
    
    console.log('✅ Database health check completed successfully');
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    if (error.code) {
      console.error(`Error code: ${error.code}`);
    }
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Database connection closed');
  }
}

checkDatabase();